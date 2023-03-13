import { Bytes } from "@graphprotocol/graph-ts";
import {
  afterAll,
  assert,
  beforeAll,
  clearStore,
  describe,
  test,
} from "matchstick-as/assembly/index";

import { handlePoolMetadataUpdated } from "../src/mappings/PoolMetadataRegistry";
import { createPoolMetadataUpdatedEvent } from "./pool-metadata-registry-utils";

describe("Describe entity assertions", () => {
  beforeAll(() => {
    const poolId = Bytes.fromI32(1234567890);
    const metadataCID = "Example string value";
    const newPoolMetadataUpdatedEvent = createPoolMetadataUpdatedEvent(
      poolId,
      metadataCID
    );
    handlePoolMetadataUpdated(newPoolMetadataUpdatedEvent);
  });

  afterAll(() => {
    clearStore();
  });

  test("PoolMetadataUpdated created and stored", () => {
    assert.entityCount("PoolMetadataUpdated", 1);

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "PoolMetadataUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "poolId",
      "1234567890"
    );
    assert.fieldEquals(
      "PoolMetadataUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "metadataCID",
      "Example string value"
    );
  });
});
