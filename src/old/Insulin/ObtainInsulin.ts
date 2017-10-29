const magik = magikcraft.io;

export function giveInsulinPotions(quantity = 1) {
    const MATERIAL = Java.type("org.bukkit.Material");
    const ItemStack = Java.type("org.bukkit.inventory.ItemStack");
    const potion = new ItemStack(MATERIAL['POTION']);

    for (let i = 0; i ++; i < quantity) {
       magik.getSender().getInventory().addItem(potion);
    }
}
