from pydantic import BaseModel
from .quantized_decimal_38 import QuantizedDecimal as D2


class ParamsModel(BaseModel):
    alpha: str
    beta: str
    l: str
    c: str
    s: str


class DerivedParamsModel(BaseModel):
    tauAlphaX: str
    tauAlphaY: str
    tauBetaX: str
    tauBetaY: str
    u: str
    v: str
    w: str
    z: str
    dSq: str
