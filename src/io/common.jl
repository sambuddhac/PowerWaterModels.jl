"""
    parse_json(path)

Parses a JavaScript Object Notation (JSON) file from the file path `path` and returns a
dictionary containing the corresponding parsed data. Primarily used for linkage files.
"""
function parse_json(path::String)
    return JSON.parsefile(path)
end


"""
    parse_files(p_file, w_file, pw_file)

Parses power, water, and power-water linkage input files and returns three data dictionaries
for power, water, and power-water linkage data, respectively.
"""
function parse_files(p_file::String, w_file::String, pw_file::String)
    # Read power distribution network data.
    if split(p_file, ".")[end] == "m" # If reading a MATPOWER file.
        p_data = _PM.parse_file(p_file)
        _scale_loads!(p_data, inv(3.0))
        _PMD.make_multiconductor!(p_data, real(3))
    else # Otherwise, use the PowerModelsDistribution parser.
        p_data = _PMD.parse_file(p_file)
    end

    # Parse water and power-water linkage data.
    w_data = _WM.parse_file(w_file) # Water distribution network data.
    pw_data = parse_json(pw_file) # Power-water network linkage data.

    # Create new network data, where network sizes match.
    p_data, w_data = make_multinetworks(p_data, w_data)

    # Return three data dictionaries.
    return p_data, w_data, pw_data
end
