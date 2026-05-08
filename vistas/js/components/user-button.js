// Configurar imagen del botón de usuario según id_type y mostrar nombre
document.addEventListener('DOMContentLoaded', () => {
    try {
        const userBtns = document.querySelectorAll('.user-btn');
        const userNames = document.querySelectorAll('.user-name');
        const userMenus = document.querySelectorAll('.user-menu');
        
        if (userBtns.length === 0) {
            console.warn('User buttons not found');
            return;
        }

        // Obtener rol y email del usuario
        const rol = localStorage.getItem('rol');
        const email = localStorage.getItem('email');
        
        // Llenar nombres de usuario
        userNames.forEach(span => {
            if (email) {
                span.textContent = email;
            }
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            userMenus.forEach(userMenu => {
                const dropdownMenu = userMenu.querySelector('.dropdown-menu');
                if (dropdownMenu && !userMenu.contains(e.target)) {
                    dropdownMenu.style.display = 'none';
                }
            });
        });
        
        // Configurar cada botón de usuario encontrado
        userBtns.forEach((userBtn, index) => {
            if (!id_type) {
                // Si no hay usuario, mostrar emoji por defecto
                userBtn.innerHTML = '👤';
                return;
            }

            try {
                const idType = parseInt(id_type); // Convertir a número
                
                const imagenes = {
                    1: '../img/png/admin.png',
                    2: '../img/png/administrativo.png',
                    3: '../img/png/egresado.png'
                };

                const imagenUsuario = imagenes[idType];
                if (!imagenUsuario) {
                    userBtn.innerHTML = '👤';
                    return;
                }

                const img = document.createElement('img');
                img.src = imagenUsuario;
                img.alt = 'User Profile';
                userBtn.innerHTML = '';
                userBtn.appendChild(img);
                
                // Agregar evento de clic para abrir/cerrar menú dropdown
                userBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const userMenu = userBtn.closest('.user-menu');
                    const dropdownMenu = userMenu.querySelector('.dropdown-menu');
                    
                    if (dropdownMenu) {
                        // Cerrar otros menús abiertos
                        userMenus.forEach(menu => {
                            const otherDropdown = menu.querySelector('.dropdown-menu');
                            if (otherDropdown && otherDropdown !== dropdownMenu) {
                                otherDropdown.style.display = 'none';
                            }
                        });
                        
                        // Alternar menú actual
                        if (dropdownMenu.style.display === 'block') {
                            dropdownMenu.style.display = 'none';
                        } else {
                            // Calcular posición correcta para fixed positioning
                            const rect = userBtn.getBoundingClientRect();
                            dropdownMenu.style.display = 'block';
                            dropdownMenu.style.top = (rect.bottom + 8) + 'px';
                            dropdownMenu.style.right = (window.innerWidth - rect.right) + 'px';
                        }
                    }
                });
            } catch (error) {
                console.error('Error configurando botón:', error);
                userBtn.innerHTML = '👤';
            }
        });
    } catch (error) {
        console.error('Error al configurar botones de usuario:', error);
    }
});
