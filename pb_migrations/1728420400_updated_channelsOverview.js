/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gqj8gmj6avinjwr")

  collection.options = {
    "query": "SELECT c.id, c.name, c.isActive, c.isPublic, COUNT(u.id) AS userCount FROM channels AS c\nLEFT JOIN users AS u ON c.users LIKE '%' + u.id + '%' GROUP BY c.id;"
  }

  // remove
  collection.schema.removeField("rqsyzopj")

  // remove
  collection.schema.removeField("6ahiiyjf")

  // remove
  collection.schema.removeField("oqjbkrfs")

  // remove
  collection.schema.removeField("0yshnpvj")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gldcktyn",
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
    "id": "kwu7egoj",
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
    "id": "vbnvklgq",
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
    "id": "jkdpgnuh",
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
    "query": "SELECT c.id, c.name, c.isActive, c.isPublic, COUNT(u.id) AS userCount FROM channels AS c\nLEFT JOIN users AS u ON c.users LIKE '%' + u.id + '%' GROUP BY  c.id;"
  }

  // add
  collection.schema.addField(new SchemaField({
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
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "6ahiiyjf",
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
    "id": "oqjbkrfs",
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
  }))

  // remove
  collection.schema.removeField("gldcktyn")

  // remove
  collection.schema.removeField("kwu7egoj")

  // remove
  collection.schema.removeField("vbnvklgq")

  // remove
  collection.schema.removeField("jkdpgnuh")

  return dao.saveCollection(collection)
})
