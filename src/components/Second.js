import Task, { useStato, useStatodis } from "./Context"
import { useState ,useEffect, useMemo, useRef } from "react"
import useMeasure from 'react-use-measure'
import { animated, useTransition} from '@react-spring/web'
import Data from "./Data"

function Quart(){

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


  const [ref, { width }] = useMeasure()
  
  let [images, setImages] = useState([ ])

  let vol = useRef(0)
  let volta = vol.current

  //The useState() works for the onClick()
  //let [adesso, setAdesso] = useState(0)

  //using useState() worjks coz we used <, not <= so we don't need +1
  function add(){
    volta += 1
    //setAdesso((x)=> x + 1)

    if( volta < Data.length ){
      console.log("added at " + volta + " " + Data.length )
      setImages((x)=> ( [...x, Data[volta] ] ))
    }else{
      console.log("all images added")
    }
  }


  let inter;

  //The started add() will trigger only once, even if it modyfies the dependency
  //when the dependency reaches it limit we clearInterval() (twice)
  //remove if want to use the onClick()
  useEffect(()=>{
    add()
    
    inter = setInterval(()=>{
      add()

      volta == Data.length && clearInterval(inter)
    }, 1000)

    return () =>{
      clearInterval(inter)
    }
  }, [volta])

  //useMemo() allows us to use the set useStates(), and updates its return values using its dependencies
  //the alto array triggers onlky once and gets updated on map()
  const [alto, tutto] = useMemo(()=> {
    let alto = new Array(columns).fill(0) 

    let tutto = images.map((cont, index)=> {

      const column = alto.indexOf(Math.min(...alto)) 

      const x = (width / columns) * column 
      const y = (alto[column] += cont.height / 2) - cont.height / 2 

      return { ...cont, x, y, width: width/ columns, height: cont.height / 2 }
    })

    return [alto, tutto]
  }, [columns, images, width])

  //We deconstuct and choose which properties to animate from 0
  let transitions = useTransition(tutto, {
    key: item => item.css,
    from: ({ x, y, width, height }) => ({ x, y, width: 0, height, opacity: 0 }),
    enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
    update: ({ x, y, width, height }) => ({ x, y, width, height }),
    leave: { height: 0, opacity: 0 },
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 5,
  })

  //We use a double container (width+padding) to keep the flex-wrap column layout
  //The container height is the biggest of the height array elements 
  return(
    <div>
      <h4 className="text-center">useEffect() added images</h4>

      <div ref={ref} className="list" style={{ height: Math.max(...alto) }}>
        
        {transitions((style, item) => (
          <animated.div style={style}>
            <div style={
              { backgroundImage: `url(${item.css}?auto=compress&dpr=2&h=500&w=500)`}
            } />
          </animated.div>
        ))}

      </div>

      <div className="text-center">
        <button className="btn btn-secondary" onClick={()=> add()}>
          Add
        </button>
      </div>

    </div>
  )
}

export default Quart;