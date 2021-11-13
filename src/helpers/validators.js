/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {allPass, equals, countBy, prop, anyPass, and, all, not} from "ramda";
import {compose} from "recompose";
import {COLORS, SHAPES} from "../constants";

const isRed = equals(COLORS.RED);
const isGreen = equals(COLORS.GREEN);
const isWhite = equals(COLORS.WHITE);
const isBlue = equals(COLORS.BLUE);
const isOrange = equals(COLORS.ORANGE);

const getStar = prop(SHAPES.STAR);
const getSquare = prop(SHAPES.SQUARE);
const getTriangle = prop(SHAPES.TRIANGLE);
const getCircle = prop(SHAPES.CIRCLE);

const getTrueCount = prop(true);

const countRed = compose(getTrueCount, countBy(isRed));
const countGreen = compose(getTrueCount, countBy(isGreen));
const countWhite = compose(getTrueCount, countBy(isWhite));
const countBlue = compose(getTrueCount, countBy(isBlue));
const countOrange = compose(getTrueCount, countBy(isOrange));

const equals2 = equals(2);
const moreThanOne = (a) => a > 0;

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = ({star, square, triangle, circle}) => {
  if (triangle !== "white" || circle !== "white") {
    return false;
  }

  return star === "red" && square === "green";
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = ({star, square, triangle, circle}) => {
  const shapes = [star, square, triangle, circle];
  const lessThanTwo = (count) => count && count > 1;
  return compose(lessThanTwo, countGreen)(shapes);
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = ({star, square, triangle, circle}) => {
  const shapes = [star, square, triangle, circle];
  const equalsBlue = equals(countBlue(shapes));
  return compose(equalsBlue, countRed)(shapes);
};

// 4. Синий круг, красная звезда, оранжевый квадрат
export const validateFieldN4 = ({star, square, triangle, circle}) => {
  return allPass([
    compose(isOrange, getSquare),
    compose(isRed, getStar),
    compose(isBlue, getCircle)
  ])({
    square,
    star,
    circle
  });
};

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = ({star, square, triangle, circle}) => {
  const shapes = [star, square, triangle, circle];
  const moreThanTwo = (count) => count && count > 2;

  return anyPass([
    compose(moreThanTwo, countRed),
    compose(moreThanTwo, countGreen),
    compose(moreThanTwo, countBlue),
    compose(moreThanTwo, countOrange)
  ])(shapes);
};

// 6. Две зеленые фигуры (одна из них треугольник), еще одна любая красная.
export const validateFieldN6 = ({star, square, triangle, circle}) =>
  and(
    compose(isGreen, getTriangle)({star, square, triangle, circle}),
    allPass([compose(moreThanOne, countRed), compose(equals2, countGreen)])([
      star,
      square,
      triangle,
      circle
    ])
  );

// 7. Все фигуры оранжевые.
export const validateFieldN7 = ({star, square, triangle, circle}) =>
  all(isOrange)([star, square, triangle, circle]);

// 8. Не красная и не белая звезда.
export const validateFieldN8 = ({star}) =>
  and(
    compose(not, isRed, getStar)({star}),
    compose(not, isWhite, getStar)({star})
  );

// 9. Все фигуры зеленые.
export const validateFieldN9 = ({star, square, triangle, circle}) =>
  all(isGreen)([star, square, triangle, circle]);

// 10. Треугольник и квадрат одного цвета (не белого)
export const validateFieldN10 = ({square, triangle}) =>
  allPass([
    compose(not, isWhite, getTriangle),
    compose(not, isWhite, getSquare),
    compose(compose(equals, getSquare)({square, triangle}), getTriangle)
  ])({square, triangle});
