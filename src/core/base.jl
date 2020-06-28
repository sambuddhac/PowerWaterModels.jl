""
function instantiate_model(p_file::String, w_file::String, pw_file::String, p_type::Type, w_type::Type, build_method; pm_ref_extensions::Vector{<:Function}=Vector{Function}([]), wm_ref_extensions=[], wm_ext=Dict{Symbol,Any}(), kwargs...)
    # Read power, water, and linkage data from files.
    p_data, w_data, pw_data = parse_files(p_file, w_file, pw_file)

    # Instantiate the PowerWaterModels object.
    return instantiate_model(p_data, w_data, pw_data, p_type, w_type,
        build_method; pm_ref_extensions=pm_ref_extensions,
        wm_ref_extensions=wm_ref_extensions, wm_ext=wm_ext, kwargs...)
end


""
function instantiate_model(p_data::Dict{String,<:Any}, w_data::Dict{String,<:Any}, pw_data::Dict{String,<:Any}, p_type::Type, w_type::Type, build_method; pm_ref_extensions::Vector{<:Function}=Vector{Function}([]), wm_ref_extensions=[], wm_ext=Dict{Symbol,Any}(), kwargs...)
    # Ensure network consistency, here.
    if !networks_are_consistent(p_data, w_data)
        Memento.error(_LOGGER, "Multinetworks are not of the same length.")
    end

    # Modify the loads associated with pumps.
    p_data = _modify_loads(p_data, w_data, pw_data)

    # Instantiate the WaterModels object.
    wm = _WM.instantiate_model(w_data, w_type, m->nothing;
        ref_extensions=wm_ref_extensions, ext=wm_ext)

    # Instantiate the PowerModelsDistribution object.
    pm = _PMD.instantiate_mc_model(p_data, p_type, m->nothing;
        ref_extensions=pm_ref_extensions, jump_model=wm.model)

    # Build the corresponding problem.
    build_method(pm, wm)

    # Return the two individual *Models objects.
    return pm, wm
end


""
function run_model(p_data::Dict{String,<:Any}, w_data::Dict{String,<:Any}, pw_data::Dict{String,<:Any}, p_type::Type, w_type::Type, optimizer, build_method; pm_solution_processors=[], wm_solution_processors=[], pm_ref_extensions::Vector{<:Function}=Vector{Function}([]), wm_ref_extensions=[], wm_ext=Dict{Symbol,Any}(), kwargs...)
    # Build the model and time its construction.
    start_time = time() # Start the timer.
    pm, wm = instantiate_model(p_data, w_data, pw_data, p_type, w_type,
        build_method; pm_ref_extensions=pm_ref_extensions,
        wm_ref_extensions=wm_ref_extensions, wm_ext=wm_ext, kwargs...)
    Memento.debug(_LOGGER, "pwm model build time: $(time() - start_time)")

    # Solve the model and build the result, timing both processes.
    start_time = time() # Start the timer.
    power_result = _IM.optimize_model!(pm, optimizer=optimizer, solution_processors=pm_solution_processors)
    water_result = _IM.build_result(wm, power_result["solve_time"]; solution_processors=wm_solution_processors)

    # Create a combined power-water result object.
    result = power_result # Contains most of the result data.

    # FIXME: There could possibly be component name clashes, here.
    _IM.update_data!(result["solution"], water_result["solution"])
    Memento.debug(_LOGGER, "pwm model solution time: $(time() - start_time)")

    # Return the combined result dictionary.
    return result
end


""
function run_model(p_file::String, w_file::String, pw_file::String, p_type::Type, w_type::Type, optimizer, build_method; pm_ref_extensions::Vector{<:Function}=Vector{Function}([]), wm_ref_extensions=[], wm_ext=Dict{Symbol,Any}(), kwargs...)
    # Read power, water, and linkage data from files.
    p_data, w_data, pw_data = parse_files(p_file, w_file, pw_file)

    # Instantiate the PowerWaterModels modeling object.
    return run_model(p_data, w_data, pw_data, p_type, w_type, optimizer,
        build_method; pm_ref_extensions=pm_ref_extensions,
        wm_ref_extensions=wm_ref_extensions, wm_ext=wm_ext, kwargs...)
end