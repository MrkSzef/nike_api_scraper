class Instore_Data_Process {
    constructor(dane) {
        this.dane = Array.from(dane["objects"]);
    }

    get_sizes() {
        if (this.dane.length == 0) {
            return "NO DATA IN STORE";
        }
        return this.dane.map((dane) => {
            return dane["styleColor"];
        });
    }
}


DATA = {
    "objects": [
      {
        "gtin": "00194500874916",
        "styleColor": "CW2288-111",
        "locationId": {
          "id": "dfac9e6e-6788-4824-892a-b73801c526d5",
          "type": "store/stores"
        },
        "level": "OOS",
        "method": "INSTORE",
        "available": false,
        "modificationDate": "2024-09-11T17:25:53.918Z"
      },
      {
        "gtin": "00194500874978",
        "styleColor": "CW2288-111",
        "locationId": {
          "id": "dfac9e6e-6788-4824-892a-b73801c526d5",
          "type": "store/stores"
        },
        "level": "OOS",
        "method": "INSTORE",
        "available": false,
        "modificationDate": "2024-09-14T12:55:22.269Z"
      },
      {
        "gtin": "00194500875005",
        "styleColor": "CW2288-111",
        "locationId": {
          "id": "dfac9e6e-6788-4824-892a-b73801c526d5",
          "type": "store/stores"
        },
        "level": "OOS",
        "method": "INSTORE",
        "available": false,
        "modificationDate": "2024-09-27T17:01:56.036Z"
      },
      {
        "gtin": "00194500874954",
        "styleColor": "CW2288-111",
        "locationId": {
          "id": "dfac9e6e-6788-4824-892a-b73801c526d5",
          "type": "store/stores"
        },
        "level": "LOW",
        "method": "INSTORE",
        "available": true,
        "modificationDate": "2024-09-23T15:57:17.103Z"
      },
      {
        "gtin": "00194500874985",
        "styleColor": "CW2288-111",
        "locationId": {
          "id": "dfac9e6e-6788-4824-892a-b73801c526d5",
          "type": "store/stores"
        },
        "level": "LOW",
        "method": "INSTORE",
        "available": true,
        "modificationDate": "2024-09-18T16:07:46.428Z"
      }
    ]
  }

IDP = new Instore_Data_Process(DATA)

console.log(IDP.get_sizes())