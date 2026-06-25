// @ts-nocheck
import { expect, test } from "bun:test"
import circuitJson from "./arduino-uno.circuit.json"
import { analyzeRouting } from "../../../lib/index"

test("runs routing analysis for arduino-uno", async () => {
  const analysis = await analyzeRouting(circuitJson)
  const regions = analysis.getLineItems()
  const text = analysis.getString()

  expect(regions.length).toBeGreaterThan(0)
  expect(
    regions.every((region) => region.lineItemType === "CongestedRegion"),
  ).toBe(true)
  expect(
    regions.every((region) => region.probabilityOfFailure.endsWith("%")),
  ).toBe(true)
  expect(
    regions.every(
      (region) =>
        Number.parseFloat(region.probabilityOfFailure) >= 0 &&
        Number.parseFloat(region.probabilityOfFailure) <= 100,
    ),
  ).toBe(true)
  expect(
    Number.parseFloat(regions[0].probabilityOfFailure),
  ).toBeGreaterThanOrEqual(
    Number.parseFloat(regions[regions.length - 1].probabilityOfFailure),
  )
  expect(regions[0].width).toBeGreaterThan(0)
  expect(regions[0].height).toBeGreaterThan(0)
  expect(regions[0].nearbyComponents.length).toBeGreaterThan(0)
  expect(regions[0].nearbyComponents[0].name).toBe("C11")

  expect(text.split("\n\n").slice(0, 2).join("\n\n")).toMatchInlineSnapshot(`
    "<CongestedRegion probabilityOfFailure="2.7%" left="-4.6mm" right="-4.5mm" bottom="-18.7mm" top="-18.2mm" width="0.1mm" height="0.5mm">
        <NearbyComponent name="C11" onLeftEdgeOfRegion onTopEdgeOfRegion onBottomEdgeOfRegion distToLeftEdgeOfRegion="-2.8mm" distToRightEdgeOfRegion="0.1mm" distToTopOfRegion="-0.9mm" distToBottomOfRegion="0.0mm" freeSpaceOnLeft="3.1mm" freeSpaceAbove=">5mm" left="-7.4mm" right="-4.6mm" bottom="-18.7mm" top="-17.3mm" />
        <NearbyComponent name="LED_PWR" distToRightEdgeOfRegion="2.6mm" distToTopOfRegion="10.9mm" freeSpaceOnRight=">5mm" freeSpaceAbove=">5mm" left="-1.9mm" right="0.5mm" bottom="-7.4mm" top="-6.4mm" />
        <NearbyComponent name="U4" distToLeftEdgeOfRegion="3.2mm" distToTopOfRegion="3.4mm" freeSpaceOnLeft="4.6mm" freeSpaceAbove=">5mm" left="-16.2mm" right="-7.8mm" bottom="-14.8mm" top="-9.2mm" />
        <NearbyComponent name="U3" distToLeftEdgeOfRegion="16.2mm" distToTopOfRegion="3.4mm" freeSpaceOnLeft=">5mm" freeSpaceAbove=">5mm" left="-29.2mm" right="-20.8mm" bottom="-14.8mm" top="-9.2mm" />
    </CongestedRegion>

    <CongestedRegion probabilityOfFailure="2.1%" left="-18.9mm" right="-18.4mm" bottom="6.9mm" top="7.3mm" width="0.6mm" height="0.4mm">
        <NearbyComponent name="U2" onLeftEdgeOfRegion onRightEdgeOfRegion onTopEdgeOfRegion distToLeftEdgeOfRegion="-3.8mm" distToRightEdgeOfRegion="-5.1mm" distToTopOfRegion="-7.5mm" distToBottomOfRegion="0.4mm" freeSpaceOnLeft="4.8mm" freeSpaceAbove=">5mm" left="-22.7mm" right="-13.3mm" bottom="7.3mm" top="14.7mm" />
        <NearbyComponent name="C3" distToRightEdgeOfRegion="13.9mm" distToBottomOfRegion="0.4mm" freeSpaceOnRight="3.4mm" freeSpaceBelow=">5mm" left="-4.5mm" right="-2.9mm" bottom="5.8mm" top="6.4mm" />
        <NearbyComponent name="R1" distToRightEdgeOfRegion="18.9mm" distToBottomOfRegion="0.4mm" freeSpaceOnRight=">5mm" freeSpaceBelow=">5mm" left="0.5mm" right="2.1mm" bottom="5.8mm" top="6.4mm" />
        <NearbyComponent name="U1" distToRightEdgeOfRegion="23.4mm" distToBottomOfRegion="1.6mm" freeSpaceOnRight=">5mm" freeSpaceBelow=">5mm" left="5.1mm" right="15.5mm" bottom="-5.1mm" top="5.3mm" />
    </CongestedRegion>"
  `)
}, 8_000)
