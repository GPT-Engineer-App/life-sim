import React, { useState, useEffect } from "react";
import { Box, Button, Grid, GridItem, Heading, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from "@chakra-ui/react";
import { FaPlay, FaPause, FaRandom } from "react-icons/fa";

const GRID_SIZE = 50;

const Index = () => {
  const [grid, setGrid] = useState(
    Array(GRID_SIZE)
      .fill()
      .map(() => Array(GRID_SIZE).fill(false)),
  );
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(100);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(runSimulation, speed);
    return () => clearInterval(timer);
  }, [running, speed]);

  const runSimulation = () => {
    setGrid((g) => {
      const next = g.map((row, i) =>
        row.map((cell, j) => {
          const neighbors = countNeighbors(g, i, j);
          return neighbors === 3 || (cell && neighbors === 2);
        }),
      );
      return next;
    });
  };

  const countNeighbors = (g, x, y) => {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        const row = (x + i + GRID_SIZE) % GRID_SIZE;
        const col = (y + j + GRID_SIZE) % GRID_SIZE;
        sum += g[row][col] ? 1 : 0;
      }
    }
    sum -= g[x][y] ? 1 : 0;
    return sum;
  };

  return (
    <Box p={4}>
      <Heading as="h1" mb={4}>
        Lovable Conway's Game of Life
      </Heading>
      <Grid templateColumns={`repeat(${GRID_SIZE}, 1fr)`} gap={0.5} mb={4}>
        {grid.map((rows, i) =>
          rows.map((col, j) => (
            <GridItem
              key={`${i}-${j}`}
              w="20px"
              h="20px"
              bg={grid[i][j] ? "white" : "black"}
              _hover={{ bg: "white" }}
              onClick={() => {
                const newGrid = [...grid];
                newGrid[i][j] = !newGrid[i][j];
                setGrid(newGrid);
              }}
            />
          )),
        )}
      </Grid>
      <Box mb={4}>
        <Button colorScheme="teal" onClick={() => setRunning(!running)} leftIcon={running ? <FaPause /> : <FaPlay />}>
          {running ? "Pause" : "Start"}
        </Button>
        <Button
          ml={2}
          onClick={() =>
            setGrid(
              Array(GRID_SIZE)
                .fill()
                .map(() => Array(GRID_SIZE).fill(false)),
            )
          }
        >
          Clear
        </Button>
        <Button
          ml={2}
          onClick={() =>
            setGrid(
              Array(GRID_SIZE)
                .fill()
                .map(() =>
                  Array(GRID_SIZE)
                    .fill()
                    .map(() => Math.random() > 0.7),
                ),
            )
          }
        >
          <FaRandom />
        </Button>
      </Box>
      <Slider aria-label="speed" min={10} max={1000} step={10} value={speed} onChange={(val) => setSpeed(val)}>
        <SliderTrack>
          <SliderFilledTrack bg="teal.500" />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </Box>
  );
};

export default Index;
