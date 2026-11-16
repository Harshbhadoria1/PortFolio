import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialSnakeState,
  isOppositeDirection,
  queueSnakeDirection,
  stepSnakeGame,
} from './snakeLogic';

test('snake engine prevents 180-degree self-reversal and advances cleanly', () => {
  const initial = createInitialSnakeState('playing', () => 0.1);
  assert.equal(isOppositeDirection('RIGHT', 'LEFT'), true);
  assert.equal(isOppositeDirection('RIGHT', 'UP'), false);

  // Attempting to reverse directly LEFT while moving RIGHT is ignored
  const reversed = queueSnakeDirection(initial, 'LEFT');
  assert.equal(reversed.pendingDirection, 'RIGHT');

  const turned = queueSnakeDirection(initial, 'UP');
  assert.equal(turned.pendingDirection, 'UP');

  const { nextState } = stepSnakeGame(turned, () => 0.1);
  assert.equal(nextState.direction, 'UP');
  assert.equal(nextState.snake[0].y, initial.snake[0].y - 1);
  assert.equal(nextState.snake.length, initial.snake.length);
});

test('snake grows and scores points when eating food, and ends on wall collision', () => {
  const state = createInitialSnakeState('playing', () => 0.5);
  const head = state.snake[0];
  const withFoodAhead = {
    ...state,
    food: { x: head.x + 1, y: head.y, kind: 'data' as const },
  };

  const { nextState, ateFood } = stepSnakeGame(withFoodAhead, () => 0.2);
  assert.equal(ateFood, 'data');
  assert.equal(nextState.score, 10);
  assert.equal(nextState.foodsEaten, 1);
  assert.equal(nextState.snake.length, state.snake.length + 1);

  // Place snake head at right wall facing RIGHT -> next step triggers gameover
  const atWall = {
    ...nextState,
    snake: [
      { x: nextState.cols - 1, y: 4 },
      { x: nextState.cols - 2, y: 4 },
      { x: nextState.cols - 3, y: 4 },
    ],
    direction: 'RIGHT' as const,
    pendingDirection: 'RIGHT' as const,
  };
  const crash = stepSnakeGame(atWall);
  assert.equal(crash.nextState.status, 'gameover');
});
