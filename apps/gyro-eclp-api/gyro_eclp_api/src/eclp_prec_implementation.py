from typing import NamedTuple, Tuple
from .quantized_decimal import QuantizedDecimal as D
from .quantized_decimal_38 import QuantizedDecimal as D2
from .quantized_decimal_100 import QuantizedDecimal as D3
from .models import ParamsModel


class DerivedParams(NamedTuple):
    tauAlpha: Tuple[D2, D2]
    tauBeta: Tuple[D2, D2]
    u: D2
    v: D2
    w: D2
    z: D2
    dSq: D2


class Vector2(NamedTuple):
    # Note: the types should really be "Any numeric type, but types have to match".
    x: D2
    y: D2

    # For compatibility with tuple representation
    def __getitem__(self, ix):
        if ix not in (0, 1):
            return KeyError(f"Only indices 0, 1 supported. Given: {ix}")
        return (self.x, self.y)[ix]


def calc_derived_values(p: ParamsModel) -> DerivedParams:
    s, c, lam, alpha, beta = (
        D(p.s).raw,
        D(p.c).raw,
        D(p.l).raw,
        D(p.alpha).raw,
        D(p.beta).raw,
    )
    s, c, lam, alpha, beta = (
        D3(s),
        D3(c),
        D3(lam),
        D3(alpha),
        D3(beta),
    )
    dSq = c * c + s * s
    d = dSq.sqrt()
    dAlpha = D3(1) / (
        ((c / d + alpha * s / d) ** 2 / lam**2 + (alpha * c / d - s / d) ** 2).sqrt()
    )
    dBeta = D3(1) / (
        ((c / d + beta * s / d) ** 2 / lam**2 + (beta * c / d - s / d) ** 2).sqrt()
    )
    tauAlpha = [0, 0]
    tauAlpha[0] = (alpha * c - s) * dAlpha
    tauAlpha[1] = (c + s * alpha) * dAlpha / lam

    tauBeta = [0, 0]
    tauBeta[0] = (beta * c - s) * dBeta
    tauBeta[1] = (c + s * beta) * dBeta / lam

    w = s * c * (tauBeta[1] - tauAlpha[1])
    z = c * c * tauBeta[0] + s * s * tauAlpha[0]
    u = s * c * (tauBeta[0] - tauAlpha[0])
    v = s * s * tauBeta[1] + c * c * tauAlpha[1]

    tauAlpha38 = (D2(tauAlpha[0].raw), D2(tauAlpha[1].raw))
    tauBeta38 = (D2(tauBeta[0].raw), D2(tauBeta[1].raw))
    derived = DerivedParams(
        tauAlpha=(tauAlpha38[0], tauAlpha38[1]),
        tauBeta=(tauBeta38[0], tauBeta38[1]),
        u=D2(u.raw),
        v=D2(v.raw),
        w=D2(w.raw),
        z=D2(z.raw),
        dSq=D2(dSq.raw),
        # dAlpha=D2(dAlpha.raw),
        # dBeta=D2(dBeta.raw),
    )
    return derived
