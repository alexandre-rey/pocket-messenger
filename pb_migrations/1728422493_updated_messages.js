/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3dfgbewkn125yc1")

  collection.listRule = "@request.auth.verified = true"
  collection.viewRule = null
  collection.createRule = "@request.auth.verified = true"
  collection.updateRule = "@request.auth.verified = true"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3dfgbewkn125yc1")

  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = ""
  collection.updateRule = ""

  return dao.saveCollection(collection)
})
