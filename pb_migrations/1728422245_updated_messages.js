/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3dfgbewkn125yc1")

  collection.listRule = ""
  collection.viewRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3dfgbewkn125yc1")

  collection.listRule = "@request.auth.id ~ channel.users.id"
  collection.viewRule = "@request.auth.id ~ channel.users.id"

  return dao.saveCollection(collection)
})
