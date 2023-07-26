import uvicorn
from fastapi import FastAPI

from gyro_eclp_api.src.models import ParamsModel, DerivedParamsModel
from gyro_eclp_api.src.eclp_prec_implementation import calc_derived_values

app = FastAPI()


@app.post("/calculate_derivative_parameters/")
async def calculate_derivative_parameters(params: ParamsModel):
    derivativeParams = calc_derived_values(params)
    return DerivedParamsModel(
        tauAlphaX=str(derivativeParams.tauAlpha[0]),
        tauAlphaY=str(derivativeParams.tauAlpha[1]),
        tauBetaX=str(derivativeParams.tauBeta[0]),
        tauBetaY=str(derivativeParams.tauBeta[1]),
        u=str(derivativeParams.u),
        v=str(derivativeParams.v),
        w=str(derivativeParams.w),
        z=str(derivativeParams.z),
        dSq=str(derivativeParams.dSq),
    )


if __name__ == "__main__":
    config = uvicorn.Config(
        "gyro_eclp_api:app",
        host="0.0.0.0",
        port=8000,
        log_level="info",
        reload=True,
    )
    server = uvicorn.Server(config)
    server.run()
