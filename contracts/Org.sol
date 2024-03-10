// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.9.0;
pragma experimental ABIEncoderV2;

contract Org {
    address admin;          // Admin Address
    uint256 MaxCount = 5;
	
    struct Admin {
        address id;
        string name;
        string addr;
        string email;
        string con;
        string typ;
        string role;
        bool verified;
    }

    struct BuyerFarmer {
        address id;
        string name;
        string aadharno;
        string addr;
        string con;
        string typ;
        string landdetails;
        string fertilizersused;
        string noofcrops;
        string role;
        bool verified;
	uint256 orderCount; // New field to store the order count
    }

    struct Seller {
        address id;
        string name;
        string email;
        string con;
        string gstno;
        string addr;
        string typ;
        string role;
        bool verified;
    }

    struct AdminMap {
        address keys;
        mapping(address => Admin) values;  
        bool inserted;  
    }

    struct BuyerFarmerMap {
        address[] keys;
        mapping(address => BuyerFarmer) values;  
        mapping(address => uint256) indexOf;    
        mapping(address => bool) inserted;  
		mapping(address => uint256) orderCount; // Mapping order count with address
        mapping(string =>address) fetchcontactaddress; //Fetching address of farmer from contact
    }

    struct SellerMap {
        address[] keys;
        mapping(address => Seller) values;  
        mapping(address => uint256) indexOf;    
        mapping(address => bool) inserted;  
    }
    
    AdminMap private adminmap;
    BuyerFarmerMap private buyerfarmermap;
    SellerMap private sellermap;

    constructor(
        string memory name,
        string memory addr,
        string memory email,
        string memory con,
        string memory typ
    ) public {
        admin = msg.sender;
        Admin memory adminval = Admin(
            admin,
            name,
            addr,
            email,
            con,
            typ,
            "admin",
            true
        );
        adminmap.values[admin] = adminval;
        adminmap.inserted = true;
    }

    event RegisterBuyerFarmer(BuyerFarmer _buyerfarmervalue);

    function registerFarmer(
        string memory name,
        string memory aadharno,
        string memory addr,
        string memory con,
        string memory typ,
        string memory landdetails,
        string memory fertilizersused,
        string memory noofcrops
    ) public {
        address sender = msg.sender;
        BuyerFarmer memory buyerfarmervalue = BuyerFarmer(
            sender,
            name,
            aadharno,
            addr,
            con,
            typ,
            landdetails,
            fertilizersused,
            noofcrops,
            "buyer",
            false,
            0 // Initialize order count to 0
        );
        buyerfarmermap.values[sender] = buyerfarmervalue;
        buyerfarmermap.inserted[sender] = true;
        buyerfarmermap.indexOf[sender] = buyerfarmermap.keys.length;
        buyerfarmermap.keys.push(sender);
        buyerfarmermap.fetchcontactaddress[con]=sender;//Fetching address of farmer from contact
        emit RegisterBuyerFarmer(buyerfarmervalue);
    }

    event RegisterSeller(Seller _sellervalue);

    function registerSeller(
        string memory name,
        string memory email,
        string memory con,
        string memory gstno,
        string memory addr,
        string memory typ
    ) public {
        address sender = msg.sender;
        Seller memory sellervalue = Seller(
            sender,
            name,
            email,
            con,
            gstno,
            addr,
            typ,
            "seller",
            false
        );
        sellermap.values[sender] = sellervalue;
        sellermap.inserted[sender] = true;
        sellermap.indexOf[sender] = sellermap.keys.length;
        sellermap.keys.push(sender);
        emit RegisterSeller(sellervalue);
    }
	
	struct Order {
        string orderId;
        string buyername;
        string contact;
        uint256 order_date;
        //address sellerId;
        //address buyerId;
        string product;
        uint quantity;
        uint price;
        //bool fulfilled;
    }

    Order[] public orders;

    event AddOrders(Order _order);

    function addOrders(

        string memory orderId,
        string memory buyername,
        string memory contact,
        uint256 order_date,
        //address sellerId;
        //address buyerId;
        string memory product,
        uint quantity,
        uint price
        //bool fulfilled
    ) public {
        require(sellermap.inserted[msg.sender], "Only registered sellers can place orders");
        
        require(buyerfarmermap.orderCount[buyerfarmermap.fetchcontactaddress[contact]]<MaxCount,"You have exceeded your order limit");
        orders.push(
            Order({
                 
                    orderId:orderId,
                    buyername:buyername,
                    contact:contact,
                    order_date:order_date,
                    product:product,
                    quantity:quantity,
                    price:price
                    //fulfilled:fulfilled
                   })
        );
    


        // Update order count for the buyer
        buyerfarmermap.orderCount[buyerfarmermap.fetchcontactaddress[contact]]++;
        emit AddOrders(orders[orders.length - 1]);
       
    }

    function getOrders() public view returns (Order[] memory) {
        return orders;
    }


    function getAdmin() public view returns (Admin memory) {
        return adminmap.values[msg.sender];
    }

    function getBuyer() public view returns (BuyerFarmer memory) {
        return buyerfarmermap.values[msg.sender];
    }

    function getSeller() public view returns (Seller memory) {
        return sellermap.values[msg.sender];
    }

    function getUnverifiedBuyers() public view returns (BuyerFarmer[] memory) {
        uint256 counter = 0;

        for (uint256 i = 0; i < buyerfarmermap.keys.length; i++) {
            BuyerFarmer memory item = buyerfarmermap.values[buyerfarmermap.keys[i]];
            if (!item.verified) counter++;
        }

        BuyerFarmer[] memory buyers = new BuyerFarmer[](counter);
        uint256 j = 0;
        for (uint256 i = 0; i < buyerfarmermap.keys.length; i++) {
            BuyerFarmer memory item = buyerfarmermap.values[buyerfarmermap.keys[i]];
            if (!item.verified) {
                buyers[j] = item;
                j++;
            }
        }
        return buyers;
    }
    
    function getUnverifiedSellers() public view returns (Seller[] memory) {
        uint256 counter = 0;

        for (uint256 i = 0; i < sellermap.keys.length; i++) {
            Seller memory item = sellermap.values[sellermap.keys[i]];
            if (!item.verified) counter++;
        }

        Seller[] memory sellers = new Seller[](counter);
        uint256 j = 0;
        for (uint256 i = 0; i < sellermap.keys.length; i++) {
            Seller memory item = sellermap.values[sellermap.keys[i]];
            if (!item.verified) {
                sellers[j] = item;
                j++;
            }
        }
        return sellers;
    }

    event VerifyBuyers(string _message);

    function verifyBuyers(address _address) public {
        require(msg.sender == admin, "Only admin can verify Organization");
        BuyerFarmer storage buyer = buyerfarmermap.values[_address];
        buyer.verified = true;
        emit VerifyBuyers("Buyer update success");
    }

    function getVerifiedBuyers() public view returns (BuyerFarmer[] memory) {
        uint256 counter = 0;

        for (uint256 i = 0; i < buyerfarmermap.keys.length; i++) {
            BuyerFarmer memory item = buyerfarmermap.values[buyerfarmermap.keys[i]];
            if (item.verified) counter++;
        }

        BuyerFarmer[] memory buyers = new BuyerFarmer[](counter); 
        uint256 j = 0;
        for (uint256 i = 0; i < buyerfarmermap.keys.length; i++) {
            BuyerFarmer memory item = buyerfarmermap.values[buyerfarmermap.keys[i]];
            if (item.verified) {
                buyers[j] = item;
                j++;
            }
        }
        return buyers;
    }

    event VerifySellers(string _message);

    function verifySellers(address _address) public {
        require(msg.sender == admin, "Only admin can verify Organization");
        Seller storage seller = sellermap.values[_address];
        seller.verified = true;
        emit VerifySellers("Seller update success");
    }

    function getVerifiedSellers() public view returns (Seller[] memory) {
        uint256 counter = 0;

        for (uint256 i = 0; i < sellermap.keys.length; i++) {
            Seller memory item = sellermap.values[sellermap.keys[i]];
            if (item.verified) counter++;
        }

        Seller[] memory sellers = new Seller[](counter); 
        uint256 j = 0;
        for (uint256 i = 0; i < sellermap.keys.length; i++) {
            Seller memory item = sellermap.values[sellermap.keys[i]];
            if (item.verified) {
                sellers[j] = item;
                j++;
            }
        }
        return sellers;
    }
}