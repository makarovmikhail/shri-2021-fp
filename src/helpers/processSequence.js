/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from "../tools/api";
import {compose, tap, andThen} from "ramda";

const api = new Api();

const processSequence = async ({
  value,
  writeLog,
  handleSuccess,
  handleError
}) => {
  const validate = (s) => {
    return (
      s.length < 10 &&
      s.length > 2 &&
      /^[0-9]*\.?[0-9]*$/.test(s) &&
      Number(value) > 0
    );
  };

  const validateValue = (value) => {
    if (!validate(value)) return handleError("ValidationError");
  };

  const roundNumber = (value) => {
    const floorDif = Number(value) - Math.floor(Number(value));
    const ceilDif = Math.ceil(Number(value)) - Number(value);
    return floorDif < ceilDif
      ? Math.floor(Number(value))
      : Math.ceil(Number(value));
  };

  const transformNumber = (number) =>
    new Promise((res, rej) =>
      api
        .get("https://api.tech/numbers/base", {from: 10, to: 2, number})
        .then(({result}) => {
          res(result);
        })
    );

  const getLength = (s) => s.toString().length;
  const square = (a) => a * a;
  const modByThree = (a) => a % 3;

  const getAnimal = (id) =>
    new Promise((res, rej) =>
      api.get(`https://animals.tech/${id}`, {}).then(({result}) => {
        res(result);
      })
    );

  compose(
    andThen(handleSuccess),
    andThen(tap(writeLog)),
    andThen(getAnimal),
    andThen(tap(writeLog)),
    andThen(modByThree),
    andThen(tap(writeLog)),
    andThen(square),
    andThen(tap(writeLog)),
    andThen(getLength),
    andThen(tap(writeLog)),
    transformNumber,
    tap(writeLog),
    roundNumber,
    tap(validateValue),
    tap(writeLog)
  )(value);
};

export default processSequence;
