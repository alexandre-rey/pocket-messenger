/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("q4lnrl43p5f5nl2")

  collection.updateRule = "@request.auth.verified = true"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("q4lnrl43p5f5nl2")

  collection.updateRule = null

  return dao.saveCollection(collection)
})
