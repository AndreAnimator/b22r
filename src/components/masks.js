import * as dateFns from "date-fns";
import IMask from "imask";

/**
 * https://stackoverflow.com/a/10452789/8786986
 * @param args
 */
const masker = ({
  masked,
  transform,
  maskDefault
}) =>
  (function () {
    const mask = IMask.createPipe(
      masked,
      IMask.PIPE_TYPE.UNMASKED,
      IMask.PIPE_TYPE.MASKED
    );

    const unmask = IMask.createPipe(
      masked,
      IMask.PIPE_TYPE.MASKED,
      IMask.PIPE_TYPE.UNMASKED
    );

    const onChange = (e) => {
      const unmasked = unmask(e.target.value);
      const newValue = mask(unmasked);
      e.target.value = newValue;
    };

    return {
      mask,
      onChange,
      transform: transform || unmask,
      unmask,
      maskDefault: maskDefault || mask
    };
  })();

const dateFormatClient = "dd/MM/yyyy";
const dateFormatApi = "yyyy-MM-dd";

export const dateMask = masker({
  masked: {
    mask: Date,
    pattern: dateFormatClient,
    blocks: {
      dd: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 31,
        maxLength: 2
      },
      MM: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 12,
        maxLength: 2
      },
      yyyy: {
        mask: IMask.MaskedRange,
        from: 1900,
        to: 9999
      }
    },
    format: (date) => {
      return dateFns.format(date, dateFormatClient);
    },
    parse: (dateStr) => {
      return dateFns.parse(dateStr, dateFormatClient, new Date());
    }
  },
  transform: (value) => {
    if (!value) {
      return value;
    }
    const date = dateFns.parse(value, dateFormatClient, new Date());
    return dateFns.format(date, dateFormatApi);
  },
  maskDefault: (value) => {
    return dateFns.format(
      dateFns.parse(value, dateFormatApi, new Date()),
      dateFormatClient
    );
  }
});

export const cpfOrCnpjMask = masker({
  masked: {
    mask: [
      {
        mask: "000.000.000-00",
        type: "CPF"
      },
      {
        mask: "00.000.000/0000-00",
        type: "CNPJ"
      }
    ],
    dispatch: (appended, dynamicMasked) => {
      const cpfMask = dynamicMasked.compiledMasks.find(
        ({ type }) => type === "CPF"
      );

      const cnpjMask = dynamicMasked.compiledMasks.find(
        ({ type }) => type === "CNPJ"
      );

      if (`${dynamicMasked.value}${appended}`.length > cpfMask.mask.length) {
        return cnpjMask;
      }

      return cpfMask;
    }
  }
});

export const phoneMask = masker({
  masked: {
    mask: [
      {
        mask: "+55 00 0000-0000",
        phone: "landline"
      },
      {
        mask: "+55 00 00000-0000",
        phone: "mobile"
      }
    ],
    dispatch: (appended, dynamicMasked) => {
      const landlineMask = dynamicMasked.compiledMasks.find(
        ({ phone }) => phone === "landline"
      );

      const mobileMask = dynamicMasked.compiledMasks.find(
        ({ phone }) => phone === "mobile"
      );

      if (
        `${dynamicMasked.value}${appended}`.length > landlineMask.mask.length
      ) {
        return mobileMask;
      }

      return landlineMask;
    }
  }
});

export const currencyMask = masker({
  masked: {
    mask: "R$ num{,}cents",
    blocks: {
      num: {
        mask: Number,
        signed: true,
        thousandsSeparator: ".",
        mapToRadix: [""],
        scale: 0
      },
      cents: {
        mask: "00",
        normalizeZeros: true,
        padFractionalZeros: true
      }
    }
  },
  transform: (value) => {
    return Number(currencyMask.unmask(value).replace(",", "."));
  },
  maskDefault: (value) => {
    return currencyMask.mask(value.toFixed(2).replace(".", ","));
  }
});
