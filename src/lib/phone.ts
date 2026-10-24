export interface CountryCode {
  iso: string
  name: string
  dial: string
}

export const COUNTRY_CODES: CountryCode[] = [
  { iso: "AR", name: "Argentina", dial: "54" },
  { iso: "UY", name: "Uruguay", dial: "598" },
  { iso: "CL", name: "Chile", dial: "56" },
  { iso: "PY", name: "Paraguay", dial: "595" },
  { iso: "BR", name: "Brasil", dial: "55" },
  { iso: "BO", name: "Bolivia", dial: "591" },
  { iso: "PE", name: "Perú", dial: "51" },
  { iso: "CO", name: "Colombia", dial: "57" },
  { iso: "EC", name: "Ecuador", dial: "593" },
  { iso: "VE", name: "Venezuela", dial: "58" },
  { iso: "MX", name: "México", dial: "52" },
  { iso: "ES", name: "España", dial: "34" },
  { iso: "US", name: "Estados Unidos", dial: "1" },
  { iso: "CA", name: "Canadá", dial: "1" },
  { iso: "IT", name: "Italia", dial: "39" },
  { iso: "FR", name: "Francia", dial: "33" },
  { iso: "DE", name: "Alemania", dial: "49" },
  { iso: "GB", name: "Reino Unido", dial: "44" },
  { iso: "PT", name: "Portugal", dial: "351" },
  { iso: "NL", name: "Países Bajos", dial: "31" },
  { iso: "BE", name: "Bélgica", dial: "32" },
  { iso: "CH", name: "Suiza", dial: "41" },
  { iso: "AT", name: "Austria", dial: "43" },
  { iso: "JP", name: "Japón", dial: "81" },
  { iso: "AU", name: "Australia", dial: "61" },
  { iso: "NZ", name: "Nueva Zelanda", dial: "64" },
  { iso: "IL", name: "Israel", dial: "972" },
]

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "")
}

export function normalizeWhatsApp(dial: string, localNumber: string): string {
  let local = digitsOnly(localNumber)
  if (!local) return ""

  const dialDigits = digitsOnly(dial)
  if (local.startsWith(dialDigits) && local.length > dialDigits.length + 6) {
    return local
  }

  if (dialDigits === "54") {
    if (local.startsWith("0")) local = local.slice(1)
    if (local.startsWith("15") && local.length >= 10) local = local.slice(2)
    if (!local.startsWith("9")) local = `9${local}`
  }

  return `${dialDigits}${local}`
}

export function whatsappChatUrl(phone: string, text: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}
