export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface GridPoint {
  x: number;
  y: number;
}

export type FoodKind = 'data' | 'chai';

export interface FoodItem extends GridPoint {
  kind: FoodKind;
}

export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover';

export interface SnakeGameState {
  cols: number;
  rows: number;
  snake: GridPoint[];
  direction: Direction;
  pendingDirection: Direction;
  food: FoodItem;
  score: number;
  foodsEaten: number;
  status: GameStatus;
  tickMs: number;
}

export const SNAKE_COLS = 20;
export const SNAKE_ROWS = 13;

export function isOppositeDirection(a: Direction, b: Direction): boolean {
  return (
    (a === 'UP' && b === 'DOWN') ||
    (a === 'DOWN' && b === 'UP') ||
    (a === 'LEFT' && b === 'RIGHT') ||
    (a === 'RIGHT' && b === 'LEFT')
  );
}

export function queueSnakeDirection(
  state: SnakeGameState,
  nextDir: Direction,
): SnakeGameState {
  if (isOppositeDirection(state.direction, nextDir)) {
    return state;
  }
  return {
    ...state,
    pendingDirection: nextDir,
  };
}

export function spawnFood(
  snake: GridPoint[],
  cols: number,
  rows: number,
  kind: FoodKind,
  rng: () => number = Math.random,
): FoodItem {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
  const freeCells: GridPoint[] = [];

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      if (!occupied.has(`${x},${y}`)) {
        freeCells.push({ x, y });
      }
    }
  }

  if (freeCells.length === 0) {
    return { x: 0, y: 0, kind };
  }

  const pick = freeCells[Math.floor(rng() * freeCells.length)] ?? freeCells[0];
  return { x: pick.x, y: pick.y, kind };
}

export function createInitialSnakeState(
  status: GameStatus = 'idle',
  rng: () => number = Math.random,
): SnakeGameState {
  const startY = Math.floor(SNAKE_ROWS / 2);
  const startX = Math.floor(SNAKE_COLS / 2) - 1;
  const snake: GridPoint[] = [
    { x: startX, y: startY },
    { x: startX - 1, y: startY },
    { x: startX - 2, y: startY },
  ];

  return {
    cols: SNAKE_COLS,
    rows: SNAKE_ROWS,
    snake,
    direction: 'RIGHT',
    pendingDirection: 'RIGHT',
    food: spawnFood(snake, SNAKE_COLS, SNAKE_ROWS, 'data', rng),
    score: 0,
    foodsEaten: 0,
    status,
    tickMs: 175,
  };
}

export function stepSnakeGame(
  state: SnakeGameState,
  rng: () => number = Math.random,
): { nextState: SnakeGameState; ateFood: FoodKind | null } {
  if (state.status !== 'playing') {
    return { nextState: state, ateFood: null };
  }

  const activeDir = isOppositeDirection(state.direction, state.pendingDirection)
    ? state.direction
    : state.pendingDirection;

  const head = state.snake[0];
  const nextHead: GridPoint = {
    x:
      activeDir === 'LEFT'
        ? head.x - 1
        : activeDir === 'RIGHT'
          ? head.x + 1
          : head.x,
    y:
      activeDir === 'UP'
        ? head.y - 1
        : activeDir === 'DOWN'
          ? head.y + 1
          : head.y,
  };

  // Wall collision check
  if (
    nextHead.x < 0 ||
    nextHead.x >= state.cols ||
    nextHead.y < 0 ||
    nextHead.y >= state.rows
  ) {
    return {
      nextState: {
        ...state,
        direction: activeDir,
        status: 'gameover',
      },
      ateFood: null,
    };
  }

  const willEat = nextHead.x === state.food.x && nextHead.y === state.food.y;
  // Exclude tail cell when checking self-collision unless growing
  const bodyToCheck = willEat ? state.snake : state.snake.slice(0, -1);
  const hitSelf = bodyToCheck.some((seg) => seg.x === nextHead.x && seg.y === nextHead.y);

  if (hitSelf) {
    return {
      nextState: {
        ...state,
        direction: activeDir,
        status: 'gameover',
      },
      ateFood: null,
    };
  }

  const nextSnake = [nextHead, ...state.snake];
  if (!willEat) {
    nextSnake.pop();
    return {
      nextState: {
        ...state,
        snake: nextSnake,
        direction: activeDir,
      },
      ateFood: null,
    };
  }

  const eatenKind = state.food.kind;
  const nextFoodsEaten = state.foodsEaten + 1;
  const points = eatenKind === 'chai' ? 25 : 10;
  const nextKind: FoodKind = nextFoodsEaten % 5 === 4 ? 'chai' : 'data';
  const nextTickMs = Math.max(85, 175 - Math.floor(nextFoodsEaten * 4));

  return {
    nextState: {
      ...state,
      snake: nextSnake,
      direction: activeDir,
      food: spawnFood(nextSnake, state.cols, state.rows, nextKind, rng),
      score: state.score + points,
      foodsEaten: nextFoodsEaten,
      tickMs: nextTickMs,
    },
    ateFood: eatenKind,
  };
}
