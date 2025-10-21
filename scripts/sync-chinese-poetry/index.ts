import { syncCaoCaoPoems } from "./caocao";
import { syncChuCiPoems } from "./chuci";

function main() {
  syncCaoCaoPoems();
  syncChuCiPoems();

  console.log("Chinese poetry synchronization complete.");
}

main();
