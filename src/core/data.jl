function make_three_phase_power_network(data::Dict{String,<:Any})
    PowerModelsDistribution.make_multiconductor!(data, 3)

    for (i, load) in data["load"]
        load["pd"] = [load["pd"][1]*0.333, load["pd"][2]*0.333, load["pd"][3]*0.333]
        load["qd"] = [load["qd"][1]*0.333, load["qd"][2]*0.333, load["qd"][3]*0.333]
    end

    return data
end

function _get_pump_bus(pdata::Dict{String,<:Any}, wdata::Dict{String,<:Any}, a::String)
    pump_name = parse(Int64, wdata["pump"][a]["source_id"][2])
    pump_mapping = filter(x -> pump_name in x.second["pump_id"], pdata["pump_mapping"])
    vals = collect(values(pump_mapping))[1]
    @assert all(y->y == vals["bus_id"][1], vals["bus_id"]) && all(y->y == vals["pump_id"][1], vals["pump_id"])
    return vals["bus_id"][1]
end

function _get_loads_from_bus(pdata::Dict{String,<:Any}, i::Int64)
    return filter(x -> i in x.second["load_bus"], pdata["load"])
end
