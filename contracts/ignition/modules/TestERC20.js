import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TestERC20Module", (m) => {
  const name = m.getParameter("name", "HackFi Test USD");
  const symbol = m.getParameter("symbol", "hfUSD");
  const decimals = m.getParameter("decimals", 6);

  const testToken = m.contract("TestERC20", [name, symbol, decimals]);

  return { testToken };
});
