/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gqj8gmj6avinjwr")

  collection.listRule = "@request.auth.verified = true"

  // remove
  collection.schema.removeField("20ua9uf1")

  // remove
  collection.schema.removeField("unv6pj8u")

  // remove
  collection.schema.removeField("bnnxfohx")

  // remove
  collection.schema.removeField("4z89yypl")

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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gqj8gmj6avinjwr")

  collection.listRule = null

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "20ua9uf1",
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
    "id": "unv6pj8u",
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
    "id": "bnnxfohx",
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
    "id": "4z89yypl",
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
  collection.schema.removeField("asjljxmj")

  // remove
  collection.schema.removeField("foiw79pc")

  // remove
  collection.schema.removeField("1umheaqv")

  // remove
  collection.schema.removeField("lge67hlz")

  return dao.saveCollection(collection)
})
