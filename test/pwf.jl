@testset "Power-Water Flow Feasibility Problems" begin
    @testset "4-bus DCPPowerModel and MILPWaterModel" begin
        pfile = "../test/data/matpower/case4.m"
        wfile = "$(wm_path)/test/data/epanet/example_1-sp.inp"
        pwfile = "../test/data/json/case4-example_1.json"

        pdata = _PM.parse_file(pfile)
        pdata = _PWM.make_three_phase_power_network(pdata)
        wdata = _WM.parse_file(wfile)
        pwdata = _PWM.parse_json(pwfile)

        ptype, wtype = _PMD.DCPPowerModel, _WM.MILPWaterModel
        result = run_pwf(pdata, wdata, pwdata, ptype, wtype, juniper)
        @test result["termination_status"] == _MOI.LOCALLY_SOLVED
        @test isapprox(result["objective"], 0.0, atol=1.0e-6)
    end

    #@testset "4-bus DCPPowerModel and MILPWaterModel (Multinetwork)" begin
    #    pfile = "../test/data/matpower/case4.m"
    #    wfile = "$(wm_path)/test/data/epanet/example_1.inp"
    #    pwfile = "../test/data/json/case4-example_1.json"

    #    wdata = _WM.parse_file(wfile)
    #    wdata = WaterModels.make_multinetwork(wdata)
    #    pdata = _PM.parse_file(pfile)
    #    pdata = _PWM.make_three_phase_power_network(pdata)
    #    pwdata = _PWM.parse_json(pwfile)

    #    ptype, wtype = _PMD.DCPPowerModel, _WM.MILPWaterModel
    #    result = run_mn_pwf(pdata, wdata, pwdata, ptype, wtype, juniper)
    #    @test result["termination_status"] == _MOI.LOCALLY_SOLVED
    #    @test isapprox(result["objective"], 0.0, atol=1.0e-6)
    #end
end
