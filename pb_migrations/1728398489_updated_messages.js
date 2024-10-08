/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3dfgbewkn125yc1")

  collection.listRule = "@request.auth.id ~ channel.users.id"
  collection.viewRule = "@request.auth.id ~ channel.users.id"
  collection.createRule = "@request.auth.id ~ channel.users.id"
  collection.updateRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3dfgbewkn125yc1")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null

  return dao.saveCollection(collection)
})
