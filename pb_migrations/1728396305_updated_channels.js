/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("q4lnrl43p5f5nl2")

  collection.listRule = "  @request.auth.id ~ users.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("q4lnrl43p5f5nl2")

  collection.listRule = null

  return dao.saveCollection(collection)
})
