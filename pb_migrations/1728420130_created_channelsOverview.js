/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "gqj8gmj6avinjwr",
    "created": "2024-10-08 20:42:10.692Z",
    "updated": "2024-10-08 20:42:10.692Z",
    "name": "channelsOverview",
    "type": "view",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "rqsyzopj",
        "name": "name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "6ahiiyjf",
        "name": "isActive",
        "type": "bool",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "oqjbkrfs",
        "name": "isPublic",
        "type": "bool",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "0yshnpvj",
        "name": "userCount",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {
      "query": "SELECT c.id, c.name, c.isActive, c.isPublic, COUNT(u.id) AS userCount FROM channels AS c\nLEFT JOIN users AS u ON c.users LIKE '%' + u.id + '%' GROUP BY  c.id;"
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("gqj8gmj6avinjwr");

  return dao.deleteCollection(collection);
})
