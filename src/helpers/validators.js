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

import {
  allPass,
  equals,
  countBy,
  prop,
  anyPass,
  and,
  all,
  not,
  chain
} from "ramda";
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

const getShapes = (shapes) => Object.values(shapes);

const countRed = compose(getTrueCount, countBy(isRed), getShapes);
const countGreen = compose(getTrueCount, countBy(isGreen), getShapes);
const countBlue = compose(getTrueCount, countBy(isBlue), getShapes);
const countOrange = compose(getTrueCount, countBy(isOrange), getShapes);

const equals1 = equals(1);
const equals2 = equals(2);
const moreThanTwo = (a) => a && a > 2;
const equalsTwoOrMore = (a) => a && a >= 2;

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
  compose(isRed, getStar),
  compose(isGreen, getSquare),
  compose(isWhite, getTriangle),
  compose(isWhite, getCircle)
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(equalsTwoOrMore, countGreen);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = ({star, square, triangle, circle}) => {
  const equalsBlue = equals(countBlue({star, square, triangle, circle}));
  return compose(equalsBlue, countRed)({star, square, triangle, circle});
};

// 4. Синий круг, красная звезда, оранжевый квадрат
export const validateFieldN4 = allPass([
  compose(isOrange, getSquare),
  compose(isRed, getStar),
  compose(isBlue, getCircle)
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = anyPass([
  compose(moreThanTwo, countRed),
  compose(moreThanTwo, countGreen),
  compose(moreThanTwo, countBlue),
  compose(moreThanTwo, countOrange)
]);

// 6. Две зеленые фигуры (одна из них треугольник), еще одна любая красная.
export const validateFieldN6 = ({star, square, triangle, circle}) =>
  and(
    compose(isGreen, getTriangle)({star, square, triangle, circle}),
    allPass([compose(equals1, countRed), compose(equals2, countGreen)])({
      star,
      square,
      triangle,
      circle
    })
  );

// 7. Все фигуры оранжевые.
export const validateFieldN7 = compose(all(isOrange), getShapes);

// 8. Не красная и не белая звезда.
export const validateFieldN8 = ({star}) =>
  and(
    compose(not, isRed, getStar)({star}),
    compose(not, isWhite, getStar)({star})
  );

// 9. Все фигуры зеленые.
export const validateFieldN9 = compose(all(isGreen), getShapes);

// 10. Треугольник и квадрат одного цвета (не белого)
export const validateFieldN10 = ({square, triangle}) =>
  allPass([
    compose(not, isWhite, getTriangle),
    compose(not, isWhite, getSquare),
    compose(compose(equals, getSquare)({square, triangle}), getTriangle)
  ])({square, triangle});
