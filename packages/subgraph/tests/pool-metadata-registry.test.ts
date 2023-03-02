import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Bytes } from "@graphprotocol/graph-ts"
import { PoolMetadataUpdated } from "../generated/schema"
import { PoolMetadataUpdated as PoolMetadataUpdatedEvent } from "../generated/PoolMetadataRegistry/PoolMetadataRegistry"
import { handlePoolMetadataUpdated } from "../src/pool-metadata-registry"
import { createPoolMetadataUpdatedEvent } from "./pool-metadata-registry-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let poolId = Bytes.fromI32(1234567890)
    let metadataCID = "Example string value"
    let newPoolMetadataUpdatedEvent = createPoolMetadataUpdatedEvent(
      poolId,
      metadataCID
    )
    handlePoolMetadataUpdated(newPoolMetadataUpdatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("PoolMetadataUpdated created and stored", () => {
    assert.entityCount("PoolMetadataUpdated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "PoolMetadataUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "poolId",
      "1234567890"
    )
    assert.fieldEquals(
      "PoolMetadataUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "metadataCID",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
