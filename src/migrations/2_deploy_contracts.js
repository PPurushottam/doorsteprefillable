const Grocery = artifacts.require("Grocery");
const Migrations = artifacts.require("Migrations");

module.exports = function (deployer) {
  deployer.deploy(Grocery);
  deployer.deploy(Migrations);

};
