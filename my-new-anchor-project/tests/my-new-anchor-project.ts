import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MyNewAnchorProject } from "../target/types/my_new_anchor_project";

describe("my-new-anchor-project", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.MyNewAnchorProject as Program<MyNewAnchorProject>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().accounts({
      
    }).rpc();
    console.log("Your transaction signature", tx);
  });
});
