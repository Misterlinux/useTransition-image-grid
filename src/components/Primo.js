import { useState ,useEffect, useMemo } from "react"
import shuffle from 'lodash.shuffle'
import useMeasure from 'react-use-measure'
import { animated, useSpring, useTransition, useSprings, useInView} from '@react-spring/web'
import Data from "./Data"

function Primo(){
  
  //useMedia() finds the matching media-query string index and returns the array column value
  function useMedia(queries, values, defaultValue) {
    const match = () => values[queries.findIndex(q => matchMedia(q).matches)] || defaultValue
    const [value, set] = useState(match)
  
    useEffect(() => {
      const handler = () => set(match)
      window.addEventListener('resize', handler)
      return () => window.removeEventListener('resize', handler)
    }, [])
  
    return value
  }

  const columns = useMedia(
    ['(min-width: 1100px)', '(min-width: 900px)', '(min-width: 600px)'], [5, 4, 3], 2)

  //We use the columns and the current width for the images
  const [ref, { width }] = useMeasure()
  const [items, set] = useState(Data)

  //This will shuffle the useState on the useTransition()
  
  //The shuffle will trigger the useMemo() dependency
  useEffect(() => {
    const t = setInterval(() => set(shuffle), 10_000)
    return () => clearInterval(t)
  }, [])

  //The useMemo() array images object will trigger useTransition
  //The heights array gets updated during the map() 
  const [heights, gridItems] = useMemo(() => {
    let heights = new Array(columns).fill(0) 

    let gridItems = items.map((child, i) => {
      
      const column = heights.indexOf(Math.min(...heights)) 

      const x = (width / columns) * column 
      const y = (heights[column] += child.height / 2) - child.height / 2 

      console.log( heights )
      return { ...child, x, y, width: width/ columns, height: child.height / 2 }
    })

    return [heights, gridItems]
  }, [columns, items, width])

  //We deconstuct the gridItems argument to animate its properties
  let transitions = useTransition(gridItems, {
    key: item => item.css,
    from: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 0 }),
    enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
    update: ({ x, y, width, height }) => ({ x, y, width, height }),
    leave: { height: 0, opacity: 0 },
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 5,
  })

  //The images are in position-absolute to sum and display their x/y and width/height style properties
  return(
    <div>

      <div ref={ref} className="list" style={{ height: Math.max(...heights) }}>

        {transitions((style, item) => (
          <animated.div style={style}>
            <div style={
              { backgroundImage: `url(${item.css}?auto=compress&dpr=2&h=500&w=500)`}
            } />
          </animated.div>
        ))}
        
      </div>

    </div>
  )
}

export default Primo;