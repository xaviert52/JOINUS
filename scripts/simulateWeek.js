const hre = require("hardhat");

async function main() {
  console.log("=======================================================");
  console.log("⏳ INICIATING TIME TRAVEL (7 DAYS) ⏳");
  console.log("=======================================================\n");

  const SECONDS_IN_A_WEEK = 7 * 24 * 60 * 60;

  // Manejo directo a traves del provider the hardhat para forzar salto EVM
  await hre.network.provider.send("evm_increaseTime", [SECONDS_IN_A_WEEK]);
  await hre.network.provider.send("evm_mine");

  console.log("✅ Time traveled 7 days into the future to simulate Weekly Epoch.");
  console.log("El entorno EVM ha avanzado exitosamente. Puedes probar los cierres y reclamos.\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
