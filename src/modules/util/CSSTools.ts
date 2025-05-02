export namespace CSSTools {
    /**
     * A function to draw a shadow for a box
     * @param weight The weight for the border of the box
     * @param color The color for the box
     * @returns A string depicting the boxes shadow
     */
    export function sharpInsetBoxShadow(weight: string, color: string): string {
        const right = `inset -${weight} 0 0 ${color}`;
        const left = `inset ${weight} 0 0 ${color}`;
        const bottom = `inset 0 -${weight} 0 ${color}`;
        const top = `inset 0 ${weight} 0 ${color}`;
        return `${top}, ${bottom}, ${left}, ${right}`;
    }
}
