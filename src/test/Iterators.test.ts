import { Iterators } from "../modules/util/Iterators";

describe('Iterators', () => {
    it('range end-only', () => {
        let counter = 0;
        for(const num of Iterators.range(10)) {
            expect(num).toBe(counter++);
        }
    });

    it('range start-end', () => {
        let counter = 5;
        for(const num of Iterators.range(5, 10)) {
            expect(num).toBe(counter++);
        }
    });

    it('range positive-step', () => {
        let counter = 5;
        for(const num of Iterators.range(5, 50, 5)) {
            expect(num).toBe(counter);
            counter += 5;
        }
    });

    it('range negative-step', () => {
        let counter = 50;
        for(const num of Iterators.range(50, 5, -5)) {
            expect(num).toBe(counter);
            counter -= 5;
        }
    });

    it('enumerate', () => {
        const elements = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
        for(const [char, i] of Iterators.enumerate(elements)) {
            expect(char).toBe(elements[i]);
        }
    });

    it('zip', () => {
        const a = ['a', 'b', 'c', 'd', 'e'];
        const b = ['f', 'g', 'h', 'i', 'j'];
        let index = 0;
        for(const [charA, charB] of Iterators.zip(a, b)) {
            expect(charA).toBe(a[index]);
            expect(charB).toBe(b[index]);
            index++;
        }
    });

    it('limit limited', () => {
        const elements = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
        let index = 0;
        for(const char of Iterators.limit(elements, 3)) {
            expect(char).toBe(elements[index]);
            index++;
        }
        expect(index).toBe(3);
    });

    it('limit exhausted', () => {
        const elements = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
        let index = 0;
        for(const char of Iterators.limit(elements, 50)) {
            expect(char).toBe(elements[index]);
            index++;
        }
        expect(index).toBe(elements.length);
    });
});
