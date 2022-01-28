import { useEffect, useState } from "react";
import classes from "./Calculator.module.css";

async function getCurrentPXT2Price() {
  try {
    //fetch current price from coinmarketcap api
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=project-x-nodes&vs_currencies=usd",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
      }
    );

    const data = await response.json();
    return data["project-x-nodes"].usd;
  } catch (e) {
    console.log(e);
    return 0;
  }
}

function getFormatedStringFromDays(numberOfDays) {
  var years = Math.floor(numberOfDays / 365);
  var months = Math.floor((numberOfDays % 365) / 30);
  var days = Math.floor((numberOfDays % 365) % 30);

  var yearsDisplay = years > 0 ? years + (years == 1 ? " year, " : " years, ") : "";
  var monthsDisplay = months > 0 ? months + (months == 1 ? " month, " : " months, ") : "";
  var daysDisplay = days > 0 ? days + (days == 1 ? " day" : " days") : "";
  return yearsDisplay + monthsDisplay + daysDisplay;
}

const Calculator = () => {
  const [currentPXT2Price, setCurrentPXT2Price] = useState(0);

  const [initialInvestment, setInitialInvestment] = useState(0);

  const [numberOfNodes, setNumberOfNodes] = useState(1);
  const [dailyNodeRewards, setDailyNodeRewards] = useState(0.17);
  const [initialPxt2Price, setInitialPxt2Price] = useState(10);
  const [futurePxt2Price, setFuturePxt2Price] = useState(100);

  const [dailyRewardEst, setDailyRewardEst] = useState(0);
  const [monthlyRewardEst, setMonthlyRewardEst] = useState(0);
  const [yearlyRewardEst, setYearlyRewardEst] = useState(0);

  const [wenLambo, setWenLambo] = useState("Infinity Years");

  const [isCompounding, setIsCompounding] = useState(false);

  const [compoundedNodes, setCompoundedNodes] = useState(100);
  const [timeUntilNodes, setTimeUntilNodes] = useState(0);
  const [daysUntilNodes, setDaysUntilNodes] = useState(0);

  useEffect(() => {
    getCurrentPXT2Price().then(res => {
      setCurrentPXT2Price(res);
    });
  }, []);

  useEffect(() => {
    setInitialInvestment((+numberOfNodes * 10 * +initialPxt2Price).toFixed(2));
  }, [numberOfNodes, initialPxt2Price, isCompounding, compoundedNodes]);

  useEffect(() => {
    setDailyRewardEst(
      ((isCompounding ? +compoundedNodes : +numberOfNodes) * +dailyNodeRewards * +futurePxt2Price).toFixed(2)
    );
    setMonthlyRewardEst(
      ((isCompounding ? +compoundedNodes : +numberOfNodes) * +dailyNodeRewards * 30 * +futurePxt2Price).toFixed(2)
    );
    setYearlyRewardEst(
      ((isCompounding ? +compoundedNodes : +numberOfNodes) * +dailyNodeRewards * 365 * +futurePxt2Price).toFixed(2)
    );
    setWenLambo(
      getFormatedStringFromDays(
        (isCompounding ? +daysUntilNodes : 0) +
          +(
            200000 /
            ((isCompounding ? +compoundedNodes : +numberOfNodes) * +dailyNodeRewards * +futurePxt2Price)
          ).toFixed(2)
      )
    );
  }, [numberOfNodes, dailyNodeRewards, futurePxt2Price, isCompounding, compoundedNodes, daysUntilNodes]);

  useEffect(() => {
    if (isCompounding) {
      let initialNumberOfNodes = +numberOfNodes;
      let finalNumberOfNodes = +compoundedNodes;
      //dailyNodeRewards
      let days = 0;

      let cumulativePxt2 = 0;
      while (initialNumberOfNodes < finalNumberOfNodes) {
        days++;

        cumulativePxt2 += initialNumberOfNodes * +dailyNodeRewards;

        while (cumulativePxt2 >= 10) {
          initialNumberOfNodes++;
          cumulativePxt2 -= 10;
        }
      }
      setDaysUntilNodes(days);
      setTimeUntilNodes(getFormatedStringFromDays(days) || "0 Days");
    } else {
      setDaysUntilNodes(0);
      setTimeUntilNodes(getFormatedStringFromDays(0));
    }
  }, [compoundedNodes, dailyNodeRewards, isCompounding, numberOfNodes]);

  return (
    <div className={classes["px-container"]}>
      <div className={classes["px-calculator"]}>
        <div className={classes["px-calculator-header"]}>
          <div className={classes["px-calculator-header-title"]}>
            <h2>PX2 Profitability Calculator (UnOfficial)</h2>
          </div>
          <div className={classes["px-calculator-header-subtitle"]}>
            <p>Calculate your potential returns from nodes.</p>
          </div>
        </div>

        <div className={classes["px-calculator-body"]}>
          <div className={classes["px-calculator-body-info"]}>
            <div className={classes["px-calculator-body-info-field"]}>
              <div className={classes["px-calculator-body-info-field-title"]}>
                <h4>Current PXT2 Price</h4>
              </div>
              <div className={classes["px-calculator-body-info-field-sub"]}>
                <h4>${currentPXT2Price}</h4>
              </div>
            </div>
            <div className={classes["px-calculator-body-info-field"]}>
              <div className={classes["px-calculator-body-info-field-title"]}>
                <h4>Daily Node Rewards</h4>
              </div>
              <div className={classes["px-calculator-body-info-field-sub"]}>
                <h4>{dailyNodeRewards} $PXT2</h4>
              </div>
            </div>
          </div>

          <div className={classes["px-calculator-body-inputs"]}>
            <div className={classes["px-calculator-body-inputs-field"]}>
              <div className={classes["px-calculator-body-inputs-item"]}>
                <div className={classes["px-calculator-body-inputs-field-title"]}>
                  <h4>Number of PXT2 Nodes</h4>
                </div>
                <div className={classes["px-calculator-body-inputs-field-sub"]}>
                  <input
                    onChange={e => {
                      setNumberOfNodes(e.target.value);
                    }}
                    value={numberOfNodes}
                    type="number"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            <div className={classes["px-calculator-body-inputs-field"]}>
              <div className={classes["px-calculator-body-inputs-item"]}>
                <div className={classes["px-calculator-body-inputs-field-title"]}>
                  <h4>Daily Node Rewards in $PXT2</h4>
                </div>
                <div className={classes["px-calculator-body-inputs-field-sub"]}>
                  <input
                    onChange={e => {
                      setDailyNodeRewards(e.target.value);
                    }}
                    value={dailyNodeRewards}
                    type="number"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            <div className={classes["px-calculator-body-inputs-field"]}>
              <div className={classes["px-calculator-body-inputs-item"]}>
                <div className={classes["px-calculator-body-inputs-field-title"]}>
                  <h4>PXT2 Price at purchase ($USD)</h4>
                </div>
                <div className={classes["px-calculator-body-inputs-field-sub"]}>
                  <input
                    onChange={e => {
                      setInitialPxt2Price(e.target.value);
                    }}
                    value={initialPxt2Price}
                    type="number"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            <div className={classes["px-calculator-body-inputs-field"]}>
              <div className={classes["px-calculator-body-inputs-item"]}>
                <div className={classes["px-calculator-body-inputs-field-title"]}>
                  <h4>Expected PXT2 future price</h4>
                </div>
                <div className={classes["px-calculator-body-inputs-field-sub"]}>
                  <input
                    onChange={e => {
                      setFuturePxt2Price(e.target.value);
                    }}
                    value={futurePxt2Price}
                    type="number"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            <div className={classes["px-calculator-body-inputs-field"]}>
              <div
                className={`${classes["px-calculator-body-inputs-item"]} ${classes["px-calculator-body-checkbox-item"]}`}
              >
                <div className={classes["px-calculator-body-checkbox-field-sub"]}>
                  <input
                    value={isCompounding}
                    onChange={() => {
                      setIsCompounding(!isCompounding);
                    }}
                    type="checkbox"
                    id="enableCompounding"
                    name="enableCompounding"
                  />
                  <label htmlFor="enableCompounding">Enable Compounding.</label>
                </div>
              </div>
            </div>
            <div className={classes["px-calculator-body-inputs-field"]}></div>

            {isCompounding && (
              <div className={classes["px-calculator-body-inputs-field"]}>
                <div className={classes["px-calculator-body-inputs-item"]}>
                  <div className={classes["px-calculator-body-inputs-field-title"]}>
                    <h4 style={{ display: "flex", justifyContent: "space-between" }}>
                      Keep compounding until #nodes reach
                      <span
                        className={classes["tooltip"]}
                        style={{
                          cursor: "pointer",
                          background: "black",
                          color: "white",
                          padding: "3px",
                          width: "25px",
                          height: "25px",
                          textAlign: "center",
                          borderRadius: "50%",
                          display: "inline-flex",
                          alignContent: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                        }}
                      >
                        ?{" "}
                        <span className={classes["tooltiptext"]}>
                          You'll start taking profits after the compounding is finished.
                        </span>
                      </span>
                    </h4>
                  </div>
                  <div className={classes["px-calculator-body-inputs-field-sub"]}>
                    <input
                      value={compoundedNodes}
                      min={1}
                      onChange={e =>
                        setCompoundedNodes(
                          +e.target.value > 10000
                            ? 10000
                            : +e.target.value < numberOfNodes
                            ? numberOfNodes
                            : +e.target.value
                        )
                      }
                      type="number"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <hr className={classes["px-divider"]} />
          <div className={classes["px-calculator-body-results"]}>
            <div className={classes["px-calculator-body-results-field"]}>
              <span>Your Initial Investment (USD)</span>
              <span>{initialInvestment}$</span>
            </div>
            {isCompounding && (
              <div className={classes["px-calculator-body-results-field"]}>
                <span>Will have {compoundedNodes} Nodes after</span>
                <span>{timeUntilNodes}</span>
              </div>
            )}
            <div className={classes["px-calculator-body-results-field"]}>
              <span>Rewards Estimation / Day (USD)</span>
              <span>{dailyRewardEst}$</span>
            </div>
            <div className={classes["px-calculator-body-results-field"]}>
              <span>Rewards Estimation / Month (USD)</span>
              <span>{monthlyRewardEst}$</span>
            </div>
            <div className={classes["px-calculator-body-results-field"]}>
              <span>Rewards Estimation / Year (USD)</span>
              <span>{yearlyRewardEst}$</span>
            </div>
            <div className={classes["px-calculator-body-results-field"]}>
              <span>wen lambo</span>
              <span>{wenLambo}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
