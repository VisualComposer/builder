/**
 * For currency items, the "_", underscore, in value field represents where amount should be placed.
 * For example, when selected "U.S. Dollar", then received value is "$_". This means, that "$" sign should go in front of the numeric amount.
 */

const options = {
  size: [
    {
      value: 'px',
      label: 'px'
    },
    {
      value: 'em',
      label: 'em'
    },
    {
      value: 'rem',
      label: 'rem'
    },
    {
      value: 'vh',
      label: 'vh'
    },
    {
      value: 'vw',
      label: 'vw'
    },
    {
      value: '%',
      label: '%'
    }
  ],
  currency: [
    {
      value: '$_',
      label: 'U.S. Dollar'
    },
    {
      value: 'CAD_',
      label: 'Canadian Dollar'
    },
    {
      value: '€_',
      label: 'Euro'
    },
    {
      value: '£_',
      label: 'Pound Sterling'
    },
    {
      value: 'AR$',
      label: 'Argentine Peso'
    },
    {
      value: 'AUD_',
      label: 'Australian Dollar'
    },
    {
      value: 'AZN_',
      label: 'Azerbaijani New Manats'
    },
    {
      value: 'BHD_',
      label: 'Bahrain Dinar'
    },
    {
      value: 'R$_',
      label: 'Brazilian Real'
    },
    {
      value: 'BGN_',
      label: 'Bulgarian Lev'
    },
    {
      value: 'XOF_',
      label: 'CFA Franc BCEAO'
    },
    {
      value: 'CL$_',
      label: 'Chilean Peso'
    },
    {
      value: 'CNY_',
      label: 'Chinese Yuan'
    },
    {
      value: 'COP_',
      label: 'Columbian Peso'
    },
    {
      value: '_Kč',
      label: 'Czech Koruna'
    },
    {
      value: 'DKK_',
      label: 'Danish Krone'
    },
    {
      value: 'EGP_',
      label: 'Egyptian Pound'
    },
    {
      value: 'FJD_',
      label: 'Fijian Dollar'
    },
    {
      value: 'GEL_',
      label: 'Georgian Lari'
    },
    {
      value: 'HK$_',
      label: 'Hong Kong Dollar'
    },
    {
      value: 'HUF_',
      label: 'Hungarian Forint'
    },
    {
      value: 'Rs._',
      label: 'Indian Rupee'
    },
    {
      value: 'Rp_',
      label: 'Indonesian Rupiah'
    },
    {
      value: '¥_',
      label: 'Japanese Yen'
    },
    {
      value: 'JOD_',
      label: 'Jordanian Dinar'
    },
    {
      value: 'KZT_',
      label: 'Kazakhstani Tenge'
    },
    {
      value: 'KRW_',
      label: 'Korean Won'
    },
    {
      value: 'KWD_',
      label: 'Kuwaiti Dinar'
    },
    {
      value: 'MYR_',
      label: 'Malaysian Ringgit'
    },
    {
      value: 'MXN_',
      label: 'Mexican Peso'
    },
    {
      value: 'MDL_',
      label: 'Moldovan Leu'
    },
    {
      value: 'NAD_',
      label: 'Namibian Dollar'
    },
    {
      value: '₪_',
      label: 'New Israeli Sheqel'
    },
    {
      value: 'TWD_',
      label: 'New Taiwan Dollar'
    },
    {
      value: 'NZD_',
      label: 'New Zealand Dollar'
    },
    {
      value: 'NOK_',
      label: 'Norwegian Krone'
    },
    {
      value: 'OMR_',
      label: 'Omani Rial'
    },
    {
      value: 'PHP',
      label: 'Philippine Peso'
    },
    {
      value: '_zł',
      label: 'Polish Zloty'
    },
    {
      value: 'QAR_',
      label: 'Qatari Riyal'
    },
    {
      value: '_lei',
      label: 'Romanian New Leu'
    },
    {
      value: '₽_',
      label: 'Russian Ruble'
    },
    {
      value: 'SAR_',
      label: 'Saudi Arabian Riyal'
    },
    {
      value: 'S$_',
      label: 'Singaporean Dollar'
    },
    {
      value: 'ZAR_',
      label: 'South Africa Rand'
    },
    {
      value: 'SEK_',
      label: 'Swedish Krona'
    },
    {
      value: 'CHF_',
      label: 'Swiss Franc'
    },
    {
      value: 'THB_',
      label: 'Thai Baht'
    },
    {
      value: 'TL_',
      label: 'Turkish Lira'
    },
    {
      value: 'AED_',
      label: 'U.A.E. Dirham'
    },
    {
      value: 'UAH_',
      label: 'Ukraine Hryvnia'
    },
    {
      value: 'BTC',
      label: 'Bitcoin'
    },
    {
      value: 'ETH',
      label: 'Ethereum'
    }
  ]
}

export default options
