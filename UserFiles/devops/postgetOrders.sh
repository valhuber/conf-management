#! /bin/bash
lac login -u demo -p Password1 http://localhost:8080/rest/default/b2bderbynw/v1 -a b2b

# Post and read order to b2b Partner
lac post PartnerOrder -j '{ "CustomerNumber": "VINET","Items": [ {"ProductNumber": 16, "Quantity": 1 },{"ProductNumber": 7,"Quantity": 2}, {"ProductNumber": 14, "Quantity": 3}, {"ProductNumber": 10, "Quantity": 4}, {"ProductNumber": 13, "Quantity": 5} ] }'

lac get nw:Orders -f 'equal(OrderID: 2000, AmountTotal: 301.20)' --format json

lacadmin logout -a b2b
