/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gqj8gmj6avinjwr")

  collection.options = {
    "query": "SELECT c.id, c.name, c.isActive, c.isPublic, COUNT(u.id) AS userCount FROM channels AS c\nLEFT JOIN users AS u ON c.users LIKE '%' || u.id || '%'\nWHERE c.`isActive` = true AND c.`isPublic` = true\nGROUP BY c.id;\n"
  }

  // remove
  collection.schema.removeField("asjljxmj")

  // remove
  collection.schema.removeField("foiw79pc")

  // remove
  collection.schema.removeField("1umheaqv")

  // remove
  collection.schema.removeField("lge67hlz")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qksvodho",
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
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cdi9bive",
    "name": "isActive",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "4m1hrykk",
    "name": "isPublic",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pqtuo76e",
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
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gqj8gmj6avinjwr")

  collection.options = {
    "query": "SELECT c.id, c.name, c.isActive, c.isPublic, COUNT(u.id) AS userCount FROM channels AS c\nLEFT JOIN users AS u ON c.users LIKE '%' || u.id || '%' GROUP BY c.id;"
  }

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "asjljxmj",
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
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "foiw79pc",
    "name": "isActive",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "1umheaqv",
    "name": "isPublic",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lge67hlz",
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
  }))

  // remove
  collection.schema.removeField("qksvodho")

  // remove
  collection.schema.removeField("cdi9bive")

  // remove
  collection.schema.removeField("4m1hrykk")

  // remove
  collection.schema.removeField("pqtuo76e")

  return dao.saveCollection(collection)
})
