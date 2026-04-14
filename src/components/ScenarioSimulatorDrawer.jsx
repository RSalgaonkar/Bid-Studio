import React, { useEffect, useMemo, useState } from "react";

function ScenarioSimulatorDrawer({
  isOpen,
  onClose,
  baseData,
  selectedPhase,
  selectedPhaseBids = [],
  getPhaseLabel,
}) {
  const [probabilityOverride, setProbabilityOverride] = useState("");
  const [amountMultiplier, setAmountMultiplier] = useState(100);

  useEffect(() => {
    if (!isOpen) {
      setProbabilityOverride("");
      setAmountMultiplier(100);
    }
  }, [isOpen]);

  const totalAmount = useMemo(() => {
    return selectedPhaseBids.reduce(
      (sum, bid) => sum + Number(bid?.amount || 0),
      0
    );
  }, [selectedPhaseBids]);

  const fallbackProbability = Number(baseData?.selectedPhaseProbability || 0);

  const effectiveProbability = useMemo(() => {
    if (probabilityOverride === "" || probabilityOverride === null) {
      return fallbackProbability;
    }
    return Number(probabilityOverride) / 100;
  }, [probabilityOverride, fallbackProbability]);

  const simulatedAmount = useMemo(() => {
    const adjustedBase = totalAmount * (Number(amountMultiplier || 100) / 100);
    return Math.round(adjustedBase * effectiveProbability);
  }, [totalAmount, amountMultiplier, effectiveProbability]);

  const baseCaseAmount = Number(baseData?.baseCase || 0);
  const variance = simulatedAmount - baseCaseAmount;

  if (!isOpen) return null;

  return (
    <>
      <div
        className="position-fixed w-100 h-100"
        style={{
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          zIndex: 1040,
        }}
        onClick={onClose}
      />

      <div
        className="position-fixed bg-white shadow-lg"
        style={{
          top: 0,
          right: 0,
          height: "100vh",
          width: "420px",
          maxWidth: "95vw",
          zIndex: 1050,
          overflowY: "auto",
        }}
      >
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1 font-weight-bold">Scenario Simulator</h5>
            <div className="text-muted small">
              {selectedPhase ? getPhaseLabel(selectedPhase) : "Select a phase first"}
            </div>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="p-4">
          <div className="mb-3">
            <label className="form-label small font-weight-bold">
              Probability Override (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              className="form-control"
              value={probabilityOverride}
              onChange={(e) => setProbabilityOverride(e.target.value)}
              placeholder="Use default probability"
            />
            <div className="small text-muted mt-2">
              Default: {Math.round(fallbackProbability * 100)}%
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small font-weight-bold">
              Amount Multiplier: {amountMultiplier}%
            </label>
            <input
              type="range"
              min="50"
              max="200"
              step="5"
              className="form-range w-100"
              value={amountMultiplier}
              onChange={(e) => setAmountMultiplier(Number(e.target.value))}
            />
          </div>

          <div className="border rounded p-3 bg-light">
            <div className="small text-muted mb-2">Simulation Output</div>

            <div className="mb-2">
              <strong>Phase Total:</strong> ₹{Number(totalAmount || 0).toLocaleString()}
            </div>

            <div className="mb-2">
              <strong>Effective Probability:</strong> {Math.round(effectiveProbability * 100)}%
            </div>

            <div className="mb-2">
              <strong>Simulated Forecast:</strong> ₹{Number(simulatedAmount || 0).toLocaleString()}
            </div>

            <div
              className={`small font-weight-bold ${
                variance >= 0 ? "text-success" : "text-danger"
              }`}
            >
              {variance >= 0 ? "+" : ""}₹{Number(variance || 0).toLocaleString()} vs Base Case
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setProbabilityOverride("");
                setAmountMultiplier(100);
              }}
            >
              Reset
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={onClose}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ScenarioSimulatorDrawer;