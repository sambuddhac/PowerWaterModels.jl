var documenterSearchIndex = {"docs":
[{"location":"math-model/#Mathematical-Models-in-PowerWaterModels","page":"Mathematical Models","title":"Mathematical Models in PowerWaterModels","text":"","category":"section"},{"location":"relaxations/#Relaxation-Schemes","page":"Relaxation Schemes","title":"Relaxation Schemes","text":"","category":"section"},{"location":"water-model/#Water-Model","page":"Water Model","title":"Water Model","text":"","category":"section"},{"location":"benchmarks/#PowerWaterModels-Benchmarks","page":"Benchmarks","title":"PowerWaterModels Benchmarks","text":"","category":"section"},{"location":"network-data/#PowerWaterModels-Network-Data-Format","page":"Network Data Format","title":"PowerWaterModels Network Data Format","text":"","category":"section"},{"location":"power-model/#Power-Model","page":"Power Model","title":"Power Model","text":"","category":"section"},{"location":"developer/#Developer-Documentation","page":"Developer","title":"Developer Documentation","text":"","category":"section"},{"location":"parser/#File-I/O","page":"File I/O","title":"File I/O","text":"","category":"section"},{"location":"parser/","page":"File I/O","title":"File I/O","text":"CurrentModule = PowerWaterModels","category":"page"},{"location":"parser/","page":"File I/O","title":"File I/O","text":"parse_files\nparse_json","category":"page"},{"location":"parser/#PowerWaterModels.parse_files","page":"File I/O","title":"PowerWaterModels.parse_files","text":"parse_files(p_file, w_file, pw_file)\n\nParses power, water, and power-water linkage input files and returns three data dictionaries for power, water, and power-water linkage data, respectively.\n\n\n\n\n\n","category":"function"},{"location":"parser/#PowerWaterModels.parse_json","page":"File I/O","title":"PowerWaterModels.parse_json","text":"parse_json(path)\n\nParses a JavaScript Object Notation (JSON) file from the file path path and returns a dictionary containing the corresponding parsed data. Primarily used for linkage files.\n\n\n\n\n\n","category":"function"},{"location":"quickguide/#Quick-Start-Guide","page":"Getting Started","title":"Quick Start Guide","text":"","category":"section"},{"location":"quickguide/","page":"Getting Started","title":"Getting Started","text":"The following guide walks through the solution of an optimal power-water flow (opwf) problem using the LinDist3FlowPowerModel power distribution network formulation (specified via PowerModelsDistribution) and the PWLRDWaterModel water distribution network formulation (specified via WaterModels).","category":"page"},{"location":"quickguide/#Installation-of-PowerWaterModels","page":"Getting Started","title":"Installation of PowerWaterModels","text":"","category":"section"},{"location":"quickguide/","page":"Getting Started","title":"Getting Started","text":"The latest stable release of PowerWaterModels can be installed using the Julia package manager with","category":"page"},{"location":"quickguide/","page":"Getting Started","title":"Getting Started","text":"] add PowerWaterModels","category":"page"},{"location":"quickguide/","page":"Getting Started","title":"Getting Started","text":"For the current development version, install the package using","category":"page"},{"location":"quickguide/","page":"Getting Started","title":"Getting Started","text":"] add PowerWaterModels#master","category":"page"},{"location":"quickguide/","page":"Getting Started","title":"Getting Started","text":"Finally, test that the package works as expected by executing","category":"page"},{"location":"quickguide/","page":"Getting Started","title":"Getting Started","text":"] test PowerWaterModels","category":"page"},{"location":"quickguide/#Installation-of-an-Optimization-Solver","page":"Getting Started","title":"Installation of an Optimization Solver","text":"","category":"section"},{"location":"quickguide/","page":"Getting Started","title":"Getting Started","text":"At least one optimization solver is required to run PowerWaterModels. The solver selected typically depends on the type of problem formulation being employed. Because of the LinDist3FlowPowerModel/PWLRDWaterModel joint formulation, the overall model considered in this tutorial is mixed-integer nonconvex quadratic. One example of an optimization package capable of solving this problem is the mixed-integer nonlinear programming solver Juniper. Juniper itself depends on the installation of a nonlinear programming solver (e.g., Ipopt) and a mixed-integer linear programming solver (e.g., CBC). Installation of the JuMP interfaces to Juniper, Ipopt, and Cbc can be performed via the Julia package manager, i.e.,","category":"page"},{"location":"quickguide/","page":"Getting Started","title":"Getting Started","text":"] add JuMP Juniper Ipopt Cbc","category":"page"},{"location":"quickguide/#(Optional)-Installation-of-Gurobi","page":"Getting Started","title":"(Optional) Installation of Gurobi","text":"","category":"section"},{"location":"quickguide/","page":"Getting Started","title":"Getting Started","text":"Juniper is likely not the best candidate to solve the mixed-integer nonconvex quadratic problem considered in this tutorial. As another example, the commercial package Gurobi can be used in its place. Assuming Gurobi has already been configured on your system, its Julia interface can be installed using the package manager with","category":"page"},{"location":"quickguide/","page":"Getting Started","title":"Getting Started","text":"] add Gurobi","category":"page"},{"location":"quickguide/#Solving-an-Optimal-Power-Water-Flow-Problem","page":"Getting Started","title":"Solving an Optimal Power-Water Flow Problem","text":"","category":"section"},{"location":"quickguide/","page":"Getting Started","title":"Getting Started","text":"After installation of the required solvers, an example optimal power-water flow problem (whose file inputs can be found in the examples directory within the PowerWaterModels repository) can be solved via","category":"page"},{"location":"quickguide/","page":"Getting Started","title":"Getting Started","text":"using JuMP, Juniper, Ipopt, Cbc\nusing PowerWaterModels\n\n# Set up the optimization solvers.\nipopt = JuMP.optimizer_with_attributes(Ipopt.Optimizer, \"print_level\"=>0, \"sb\"=>\"yes\")\ncbc = JuMP.optimizer_with_attributes(Cbc.Optimizer, \"logLevel\"=>0)\njuniper = JuMP.optimizer_with_attributes(\n    Juniper.Optimizer, \"nl_solver\"=>ipopt, \"mip_solver\"=>cbc,\n    \"branch_strategy\" => :MostInfeasible, \"time_limit\" => 60.0)\n\n# Specify paths to the power, water, and power-water linking files.\np_file = \"examples/data/opendss/IEEE13_CDPSM.dss\" # Power network.\nw_file = \"examples/data/epanet/cohen-short.inp\" # Water network.\npw_file = \"examples/data/json/zamzam.json\" # Power-water linking.\n\n# Specify the power and water formulation types separately.\np_type, w_type = LinDist3FlowPowerModel, PWLRDWaterModel\n\n# Specify the number of breakpoints used in the linearized water formulation.\nwm_ext = Dict{Symbol,Any}(:pipe_breakpoints=>2, :pump_breakpoints=>3)\n\n# Solve the joint optimal power-water flow problem and store the result.\nresult = run_opwf(p_file, w_file, pw_file, p_type, w_type, juniper; wm_ext=wm_ext)","category":"page"},{"location":"quickguide/#(Optional)-Solving-the-Problem-with-Gurobi","page":"Getting Started","title":"(Optional) Solving the Problem with Gurobi","text":"","category":"section"},{"location":"quickguide/","page":"Getting Started","title":"Getting Started","text":"Note that Gurobi's NonConvex=2 parameter setting ensures it will correctly handle the nonconvex quadratic constraints that are associated with the power network formulation. The problem considered above can then be solved using Gurobi (instead of Juniper) via","category":"page"},{"location":"quickguide/","page":"Getting Started","title":"Getting Started","text":"import Gurobi\n\n# Solve the joint optimal power-water flow problem and store its result.\ngurobi = JuMP.optimizer_with_attributes(Gurobi.Optimizer, \"NonConvex\"=>2)\nresult_grb = run_opwf(p_file, w_file, pw_file, p_type, w_type, gurobi; wm_ext=wm_ext)","category":"page"},{"location":"quickguide/","page":"Getting Started","title":"Getting Started","text":"First, note that Gurobi solves the problem much more quickly than Juniper. Also note the difference in the objectives obtained between Juniper and Gurobi, i.e.,","category":"page"},{"location":"quickguide/","page":"Getting Started","title":"Getting Started","text":"result[\"objective\"] - result_grb[\"objective\"] # Positive difference.","category":"page"},{"location":"quickguide/","page":"Getting Started","title":"Getting Started","text":"The objective value obtained via Gurobi is smaller than the one obtained via Juniper, indicating that Gurobi discovered a better solution.","category":"page"},{"location":"quickguide/#Obtaining-Results","page":"Getting Started","title":"Obtaining Results","text":"","category":"section"},{"location":"quickguide/","page":"Getting Started","title":"Getting Started","text":"The run commands in PowerWaterModels return detailed results data in the form of a Julia Dict. This dictionary can be saved for further processing as follows:","category":"page"},{"location":"quickguide/","page":"Getting Started","title":"Getting Started","text":"result = run_opwf(p_file, w_file, pw_file, p_type, w_type, juniper; wm_ext=wm_ext)","category":"page"},{"location":"quickguide/","page":"Getting Started","title":"Getting Started","text":"For example, the algorithm's runtime and final objective value can be accessed with","category":"page"},{"location":"quickguide/","page":"Getting Started","title":"Getting Started","text":"result[\"solve_time\"] # Total solve time required (seconds).\nresult[\"objective\"] # Final objective value (in units of the objective).","category":"page"},{"location":"quickguide/","page":"Getting Started","title":"Getting Started","text":"The \"solution\" field contains detailed information about the solution produced by the run method. For example, the following can be used to inspect the temporal variation in the volume of tank 1 in the water distribution network:","category":"page"},{"location":"quickguide/","page":"Getting Started","title":"Getting Started","text":"tank_1_volume = Dict(nw=>data[\"tank\"][\"10\"][\"V\"] for (nw, data) in result[\"solution\"][\"nw\"])","category":"page"},{"location":"quickguide/","page":"Getting Started","title":"Getting Started","text":"For more information about PowerWaterModels result data, see the PowerWaterModels Result Data Format section.","category":"page"},{"location":"quickguide/#Modifying-Network-Data","page":"Getting Started","title":"Modifying Network Data","text":"","category":"section"},{"location":"quickguide/","page":"Getting Started","title":"Getting Started","text":"The following example demonstrates one way to perform PowerWaterModels solves while modifying network data.","category":"page"},{"location":"quickguide/","page":"Getting Started","title":"Getting Started","text":"p_data, w_data, pw_data = parse_files(p_file, w_file, pw_file)\n\nfor (nw, network) in w_data[\"nw\"]\n    network[\"demand\"][\"3\"][\"flow_nominal\"] *= 0.1\n    network[\"demand\"][\"4\"][\"flow_nominal\"] *= 0.1\n    network[\"demand\"][\"5\"][\"flow_nominal\"] *= 0.1\nend\n\nresult_mod = run_opwf(p_data, w_data, pw_data, p_type, w_type, juniper; wm_ext=wm_ext)","category":"page"},{"location":"quickguide/","page":"Getting Started","title":"Getting Started","text":"Note that the smaller demands in the modified problem result in an overall smaller objective value. For additional details about the network data, see the PowerWaterModels Network Data Format section.","category":"page"},{"location":"quickguide/#Alternate-Methods-for-Building-and-Solving-Models","page":"Getting Started","title":"Alternate Methods for Building and Solving Models","text":"","category":"section"},{"location":"quickguide/","page":"Getting Started","title":"Getting Started","text":"The following example demonstrates how to break a run_opwf call into separate model building and solving steps. This allows inspection of the JuMP model created by PowerWaterModels for the problem.","category":"page"},{"location":"quickguide/","page":"Getting Started","title":"Getting Started","text":"# Instantiate the joint power-water models.\npm, wm = instantiate_model(p_data, w_data, pw_data, p_type, w_type, build_opwf; wm_ext=wm_ext)\n\n# Print the (shared) JuMP model.\nprint(pm.model)\n\n# Create separate power and water result dictionaries.\npower_result = PowerWaterModels._IM.optimize_model!(pm, optimizer=juniper)\nwater_result = PowerWaterModels._IM.build_result(wm, power_result[\"solve_time\"])","category":"page"},{"location":"constraints/#Constraints","page":"Constraints","title":"Constraints","text":"","category":"section"},{"location":"constraints/","page":"Constraints","title":"Constraints","text":"CurrentModule = PowerWaterModels","category":"page"},{"location":"constraints/#Linking-Constraints","page":"Constraints","title":"Linking Constraints","text":"","category":"section"},{"location":"specifications/#Problem-Specifications","page":"Problem Specifications","title":"Problem Specifications","text":"","category":"section"},{"location":"specifications/#Power-Water-Flow-(PWF)","page":"Problem Specifications","title":"Power-Water Flow (PWF)","text":"","category":"section"},{"location":"specifications/#Optimal-Power-Water-Flow-(OPWF)","page":"Problem Specifications","title":"Optimal Power-Water Flow (OPWF)","text":"","category":"section"},{"location":"result-data/#PowerWaterModels-Result-Data-Format","page":"Result Data Format","title":"PowerWaterModels Result Data Format","text":"","category":"section"},{"location":"formulations/#Network-Formulations","page":"Network Formulations","title":"Network Formulations","text":"","category":"section"},{"location":"variables/#Variables","page":"Variables","title":"Variables","text":"","category":"section"},{"location":"objective/#Objective","page":"Objective","title":"Objective","text":"","category":"section"},{"location":"objective/#Objective-Functions","page":"Objective","title":"Objective Functions","text":"","category":"section"},{"location":"#PowerWaterModels.jl-Documentation","page":"Home","title":"PowerWaterModels.jl Documentation","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"CurrentModule = PowerWaterModels","category":"page"},{"location":"#Overview","page":"Home","title":"Overview","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"PowerWaterModels.jl is a Julia/JuMP package for the joint optimization of steady state power and water distribution networks. It is designed to enable the computational evaluation of historical and emerging power-water network optimization formulations and algorithms using a common platform. The code is engineered to decouple Problem Specifications (e.g., power-water flow, optimal power-water flow) from Network Formulations (e.g., mixed-integer linear, mixed-integer nonlinear). This decoupling enables the definition of a variety of optimization formulations and their comparison on common problem specifications.","category":"page"},{"location":"#Installation","page":"Home","title":"Installation","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"The latest stable release of PowerWaterModels can be installed using the Julia package manager with","category":"page"},{"location":"","page":"Home","title":"Home","text":"] add PowerWaterModels","category":"page"},{"location":"","page":"Home","title":"Home","text":"For the current development version, install the package using","category":"page"},{"location":"","page":"Home","title":"Home","text":"] add PowerWaterModels#master","category":"page"},{"location":"","page":"Home","title":"Home","text":"Finally, test that the package works as expected by executing","category":"page"},{"location":"","page":"Home","title":"Home","text":"] test PowerWaterModels","category":"page"},{"location":"#Usage-at-a-Glance","page":"Home","title":"Usage at a Glance","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"At least one optimization solver is required to run PowerWaterModels. The solver selected typically depends on the type of problem formulation being employed. As an example, the mixed-integer nonlinear programming solver Juniper can be used for testing any of the problem formulations considered in this package. Juniper itself depends on the installation of a nonlinear programming solver (e.g., Ipopt) and a mixed-integer linear programming solver (e.g., CBC). Installation of the JuMP interfaces to Juniper, Ipopt, and Cbc can be performed via the Julia package manager, i.e.,","category":"page"},{"location":"","page":"Home","title":"Home","text":"] add JuMP Juniper Ipopt Cbc","category":"page"},{"location":"","page":"Home","title":"Home","text":"After installation of the required solvers, an example optimal power-water flow problem (whose file inputs can be found in the examples directory within the PowerWaterModels repository) can be solved via","category":"page"},{"location":"","page":"Home","title":"Home","text":"using JuMP, Juniper, Ipopt, Cbc\nusing PowerWaterModels\n\n# Set up the optimization solvers.\nipopt = JuMP.optimizer_with_attributes(Ipopt.Optimizer, \"print_level\"=>0, \"sb\"=>\"yes\")\ncbc = JuMP.optimizer_with_attributes(Cbc.Optimizer, \"logLevel\"=>0)\njuniper = JuMP.optimizer_with_attributes(\n    Juniper.Optimizer, \"nl_solver\"=>ipopt, \"mip_solver\"=>cbc,\n    \"branch_strategy\" => :MostInfeasible, \"time_limit\" => 60.0)\n\n# Specify paths to the power, water, and power-water linking files.\np_file = \"examples/data/opendss/IEEE13_CDPSM.dss\" # Power network.\nw_file = \"examples/data/epanet/cohen-short.inp\" # Water network.\npw_file = \"examples/data/json/zamzam.json\" # Power-water linking.\n\n# Specify the power and water formulation types separately.\np_type, w_type = LinDist3FlowPowerModel, PWLRDWaterModel\n\n# Specify the number of breakpoints used in the linearized water formulation.\nwm_ext = Dict{Symbol,Any}(:pipe_breakpoints=>2, :pump_breakpoints=>3)\n\n# Solve the joint optimal power-water flow problem and store the result.\nresult = run_opwf(p_file, w_file, pw_file, p_type, w_type, juniper; wm_ext=wm_ext)","category":"page"},{"location":"","page":"Home","title":"Home","text":"After solving the problem, results can then be analyzed, e.g.,","category":"page"},{"location":"","page":"Home","title":"Home","text":"# Objective value, representing the cost of power generation.\nresult[\"objective\"]\n\n# Generator 1's real power generation at the first time step.\nresult[\"solution\"][\"nw\"][\"1\"][\"gen\"][\"1\"][\"pg\"]\n\n# Pump 2's head gain at the third time step.\nresult[\"solution\"][\"nw\"][\"3\"][\"pump\"][\"2\"][\"g\"]","category":"page"}]
}
