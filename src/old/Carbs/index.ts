export { Food } from './Foods';

const magik = magikcraft.io;

export function giveFood(quantity = 1) {
    const MATERIAL = Java.type("org.bukkit.Material");
    const ItemStack = Java.type("org.bukkit.inventory.ItemStack");
    const food = new ItemStack(MATERIAL.APPLE);

    for (let i = 0; i ++; i < quantity) {
       magik.getSender().getInventory().addItem(food);
    }
}