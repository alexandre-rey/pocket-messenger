/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3dfgbewkn125yc1")

  collection.createRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3dfgbewkn125yc1")

  collection.createRule = "@request.auth.id ~ channel.users.id"

  return dao.saveCollection(collection)
})
