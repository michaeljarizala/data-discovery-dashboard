
export const extractInitials = (str: string): string => {
    const wrd = str.split(" ")
    const intls = wrd.map((w) => w.charAt(0).toUpperCase())

    return intls.join("")
}

export const pickRandomColors = (): string => {
    const colors = [
        "red",
        "orange",
        "yellow",
        "lime",
        "emerald",
        "cyan",
        "blue",
        "indigo",
        "purple",
        "pink",
        "slate",
    ]

    const rIdx = Math.floor(Math.random() * colors.length)
    console.log(colors[rIdx])

    return colors[rIdx]
}