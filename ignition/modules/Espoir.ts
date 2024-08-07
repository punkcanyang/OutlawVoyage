import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "viem";

const HOUSE_CUT = 30n;

const EspoirModule = buildModule("Espoir", (m) => {
  const houseCut = m.getParameter("houseCut", HOUSE_CUT);

  const token = m.contract("Espoir", [houseCut]);

  console.log('token: ', token)

  return { token };
});

export default EspoirModule;
