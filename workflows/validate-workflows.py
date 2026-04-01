#!/usr/bin/env python3
"""
Script de validación para workflows n8n de VocTest IA
Verifica que los JSONs sean válidos y tengan la estructura correcta
"""

import json
import sys
import os
from pathlib import Path
from typing import Dict, List, Tuple

class Colors:
    """Colores para output en terminal"""
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def print_color(color: str, message: str):
    """Imprime mensaje con color"""
    print(f"{color}{message}{Colors.RESET}")

def validate_json_file(file_path: str) -> Tuple[bool, List[str]]:
    """Valida que un archivo JSON sea válido y tenga la estructura esperada"""
    errors = []
    
    try:
        # Verificar que el archivo existe
        if not os.path.exists(file_path):
            return False, [f"Archivo no encontrado: {file_path}"]
        
        # Leer y parsear JSON
        with open(file_path, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError as e:
                return False, [f"JSON inválido: {str(e)}"]
        
        # Verificar estructura básica de workflow de n8n
        if not isinstance(data, dict):
            return False, ["El JSON debe ser un objeto"]
        
        # Verificar campos obligatorios
        required_fields = ['name', 'nodes', 'connections']
        for field in required_fields:
            if field not in data:
                errors.append(f"Campo obligatorio faltante: {field}")
        
        # Verificar que nodes sea una lista
        if 'nodes' in data and not isinstance(data['nodes'], list):
            errors.append("'nodes' debe ser una lista")
        
        # Verificar que connections sea un objeto
        if 'connections' in data and not isinstance(data['connections'], dict):
            errors.append("'connections' debe ser un objeto")
        
        # Verificar que cada nodo tenga campos básicos
        if 'nodes' in data:
            for i, node in enumerate(data['nodes']):
                node_errors = []
                if 'name' not in node:
                    node_errors.append(f"Nodo {i}: falta 'name'")
                if 'type' not in node:
                    node_errors.append(f"Nodo {i}: falta 'type'")
                if 'position' not in node:
                    node_errors.append(f"Nodo {i}: falta 'position'")
                if node_errors:
                    errors.extend(node_errors)
        
        return len(errors) == 0, errors
        
    except Exception as e:
        return False, [f"Error inesperado: {str(e)}"]

def check_workflow_connections(data: dict) -> List[str]:
    """Verifica que las conexiones entre nodos sean válidas"""
    errors = []
    node_names = {node['name'] for node in data.get('nodes', [])}
    
    for source_node, connections in data.get('connections', {}).items():
        # Verificar que el nodo fuente exista
        if source_node not in node_names:
            errors.append(f"Nodo fuente no existe: {source_node}")
        
        # Verificar conexiones
        if 'main' in connections:
            for output_index, output_connections in enumerate(connections['main']):
                if output_connections is not None:
                    for connection in output_connections:
                        if 'node' in connection:
                            target_node = connection['node']
                            if target_node not in node_names:
                                errors.append(f"Nodo destino no existe: {target_node}")
    
    return errors

def main():
    """Función principal"""
    print_color(Colors.BOLD, "🔍 Validador de Workflows n8n - VocTest IA")
    print_color(Colors.BOLD, "=" * 50)
    print()
    
    # Directorio de workflows
    workflows_dir = Path(__file__).parent
    
    # Archivos a validar
    workflow_files = [
        "01-orquestador-principal.json",
        "02-chat-conversacional.json",
        "03-analisis-informe.json"
    ]
    
    all_valid = True
    
    for filename in workflow_files:
        file_path = workflows_dir / filename
        print_color(Colors.BLUE, f"📄 Validando: {filename}")
        
        # Validar JSON
        is_valid, json_errors = validate_json_file(str(file_path))
        
        if not is_valid:
            print_color(Colors.RED, f"   ❌ JSON inválido:")
            for error in json_errors:
                print_color(Colors.RED, f"      • {error}")
            all_valid = False
            continue
        
        print_color(Colors.GREEN, "   ✅ JSON válido")
        
        # Leer datos para validación adicional
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Verificar conexiones
        connection_errors = check_workflow_connections(data)
        if connection_errors:
            print_color(Colors.YELLOW, "   ⚠️  Problemas de conexión:")
            for error in connection_errors:
                print_color(Colors.YELLOW, f"      • {error}")
        else:
            print_color(Colors.GREEN, "   ✅ Conexiones válidas")
        
        # Mostrar información del workflow
        print_color(Colors.YELLOW, f"   📋 Nombre: {data.get('name', 'Sin nombre')}")
        print_color(Colors.YELLOW, f"   📦 Nodos: {len(data.get('nodes', []))}")
        print_color(Colors.YELLOW, f"   🔗 Conexiones: {len(data.get('connections', {}))}")
        
        print()
    
    # Resumen final
    print_color(Colors.BOLD, "=" * 50)
    if all_valid:
        print_color(Colors.GREEN, "🎉 Todos los workflows son válidos!")
        print_color(Colors.GREEN, "✅ Puedes importarlos en n8n sin problemas")
        return 0
    else:
        print_color(Colors.RED, "❌ Algunos workflows tienen problemas")
        print_color(Colors.YELLOW, "🔧 Revisa los errores arriba y corrígelos")
        return 1

if __name__ == "__main__":
    sys.exit(main())
