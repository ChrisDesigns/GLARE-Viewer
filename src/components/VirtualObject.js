import React from 'react';
import { useGLTF } from '@react-three/drei'


const VirtualObject = ({ tourBasePath, virtual_object }) => {
    const { nodes, materials } = useGLTF(tourBasePath + virtual_object, true);
    return (
        <group dispose={null} position={[0, 0, -5]}>
            <mesh
                material={materials["Material.001"]}
                geometry={nodes.Scene.children[0].geometry}
            />
        </group>
    );
};

export { VirtualObject };