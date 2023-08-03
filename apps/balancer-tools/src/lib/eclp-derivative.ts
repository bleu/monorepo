import { DerivedGyroEParamsFromSubgraph } from "@bleu-balancer-tools/math-poolsimulator/src/gyroE";

import { AnalysisData } from "#/contexts/PoolSimulatorContext";

export const fetchECLPDerivativeParams = async (data: AnalysisData) => {
  const url =
    process.env.NODE_ENV == "development"
      ? "http://localhost:8000"
      : "https://gyro-eclp-api.fly.dev";
  return fetch(`${url}/calculate_derivative_parameters`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      alpha: String(data.poolParams?.alpha),
      beta: String(data.poolParams?.beta),
      l: String(data.poolParams?.lambda),
      c: String(data.poolParams?.c),
      s: String(data.poolParams?.s),
    }),
  })
    .then((res) => res.json())
    .then((res) => res as DerivedGyroEParamsFromSubgraph);
};
