/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3dfgbewkn125yc1")

  collection.indexes = [
    "CREATE INDEX `idx_dFXSKbX` ON `messages` (`channel`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3dfgbewkn125yc1")

  collection.indexes = []

  return dao.saveCollection(collection)
})
