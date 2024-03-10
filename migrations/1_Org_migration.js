const Organization = artifacts.require("Org");

module.exports = function (deployer) {
    deployer.deploy(
        Organization,
        "Department of Chemicals and Fertilizers",
        "Shastri Bhawan, New Delhi - 110001 (India)",
        "dbtcell-fert@gov.in",
        "1800115501",
        "dbtcell-fertilzer"
    );
};
