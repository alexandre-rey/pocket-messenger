/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("q4lnrl43p5f5nl2")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pxc8mlak",
    "name": "isPublic",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("q4lnrl43p5f5nl2")

  // remove
  collection.schema.removeField("pxc8mlak")

  return dao.saveCollection(collection)
})
